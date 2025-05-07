'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface AnalysisResult {
  score: {
    content_completeness: number
    job_match: number
    keyword_coverage: number
    project_description: number
    expression_quality: number
    total: number
  }
  analysis: {
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
  }
  keyword_analysis: {
    matched_keywords: string[]
    missing_keywords: string[]
  }
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedResult = localStorage.getItem('analysisResult')
      if (!savedResult) {
        setError('未找到分析结果')
        return
      }

      const parsedResult = JSON.parse(savedResult)
      
      // 验证结果格式
      if (!parsedResult.score || !parsedResult.analysis || !parsedResult.keyword_analysis) {
        setError('分析结果格式不正确')
        return
      }

      setResult(parsedResult)
    } catch (error) {
      console.error('解析结果失败:', error)
      setError('解析结果失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <button
          onClick={() => router.push('/')}
          className="text-neon hover:text-neon/80 transition-colors"
        >
          返回首页
        </button>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">未找到分析结果</div>
        <button
          onClick={() => router.push('/')}
          className="text-neon hover:text-neon/80 transition-colors"
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">简历分析结果</h1>
          <button
            onClick={() => router.push('/')}
            className="text-neon hover:text-neon/80 transition-colors"
          >
            返回首页
          </button>
        </div>

        {/* 总分展示 */}
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-48 h-48">
              <CircularProgressbar
                value={result.score.total}
                text={`${result.score.total}`}
                styles={buildStyles({
                  pathColor: '#00ff9d',
                  textColor: '#00ff9d',
                  trailColor: '#374151',
                })}
              />
            </div>
          </div>

          {/* 详细分数 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">内容完整性</div>
              <div className="text-neon text-2xl font-bold">{result.score.content_completeness}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">职位匹配度</div>
              <div className="text-neon text-2xl font-bold">{result.score.job_match}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">关键词覆盖</div>
              <div className="text-neon text-2xl font-bold">{result.score.keyword_coverage}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">项目描述</div>
              <div className="text-neon text-2xl font-bold">{result.score.project_description}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">表达逻辑</div>
              <div className="text-neon text-2xl font-bold">{result.score.expression_quality}</div>
            </div>
          </div>
        </div>

        {/* 分析结果 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 优势 */}
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">优势分析</h2>
            <ul className="space-y-2">
              {result.analysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-neon mr-2">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* 不足 */}
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">需要改进</h2>
            <ul className="space-y-2">
              {result.analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* 优化建议 */}
          <div className="bg-gray-800/50 rounded-2xl p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">优化建议</h2>
            <ul className="space-y-2">
              {result.analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-neon mr-2">{index + 1}.</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* 关键词分析 */}
          <div className="bg-gray-800/50 rounded-2xl p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">关键词分析</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-neon mb-3">已匹配关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_analysis.matched_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neon/20 text-neon rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-3">建议添加关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_analysis.missing_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 