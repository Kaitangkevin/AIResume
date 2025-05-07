import { NextResponse } from 'next/server'

const MAX_RETRIES = 5 // 增加最大重试次数
const INITIAL_RETRY_DELAY = 2000 // 初始重试延迟 2 秒

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 计算指数退避延迟时间
function getExponentialBackoffDelay(retryCount: number): number {
  return INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
}

async function callMoonshotAPI(content: string, targetJob: string, retryCount = 0): Promise<any> {
  try {
    const prompt = `请分析以下简历内容，针对${targetJob}职位进行评估，并返回以下格式的 JSON 结果：
{
  "score": {
    "content_completeness": 分数,
    "job_match": 分数,
    "keyword_coverage": 分数,
    "project_description": 分数,
    "expression_quality": 分数,
    "total": 总分
  },
  "analysis": {
    "strengths": ["优势1", "优势2", ...],
    "weaknesses": ["不足1", "不足2", ...],
    "suggestions": ["建议1", "建议2", ...]
  },
  "keyword_analysis": {
    "matched_keywords": ["已匹配关键词1", "已匹配关键词2", ...],
    "missing_keywords": ["建议添加关键词1", "建议添加关键词2", ...]
  }
}

请确保返回的是有效的 JSON 格式，所有分数范围在 0-100 之间。`

    console.log(`开始调用 Moonshot API... (第 ${retryCount + 1} 次尝试)`)
    
    // 检查内容长度
    if (content.length > 32000) {
      console.log('内容过长，进行截断...')
      content = content.substring(0, 32000)
    }

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MOONSHOT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-32k',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Moonshot API 请求失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        retryCount
      })

      // 如果是速率限制错误且还有重试次数，则等待后重试
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        const delay = getExponentialBackoffDelay(retryCount)
        console.log(`遇到速率限制，等待 ${delay}ms 后重试...`)
        await sleep(delay)
        return callMoonshotAPI(content, targetJob, retryCount + 1)
      }

      // 如果是其他错误，也尝试重试
      if (retryCount < MAX_RETRIES) {
        const delay = getExponentialBackoffDelay(retryCount)
        console.log(`请求失败，等待 ${delay}ms 后重试...`)
        await sleep(delay)
        return callMoonshotAPI(content, targetJob, retryCount + 1)
      }

      throw new Error(`Moonshot API 请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Moonshot API 响应成功')
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Moonshot API 响应格式错误:', data)
      throw new Error('API 响应格式错误')
    }

    // 尝试解析返回的 JSON
    try {
      const result = JSON.parse(data.choices[0].message.content)
      return result
    } catch (e) {
      console.error('JSON 解析失败:', e)
      throw new Error('返回结果格式错误')
    }
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = getExponentialBackoffDelay(retryCount)
      console.log(`发生错误，等待 ${delay}ms 后重试...`)
      await sleep(delay)
      return callMoonshotAPI(content, targetJob, retryCount + 1)
    }
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { content, targetJob } = await request.json()

    if (!content || !targetJob) {
      console.error('缺少必要参数:', { content: !!content, targetJob: !!targetJob })
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const result = await callMoonshotAPI(content, targetJob)
    console.log('分析完成，返回结果')
    return NextResponse.json(result)
  } catch (error) {
    console.error('分析失败:', error)
    return NextResponse.json(
      { 
        error: '分析失败，请稍后重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 