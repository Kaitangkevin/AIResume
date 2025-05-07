import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      )
    }

    // 检查文件类型
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 检查文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '文件大小不能超过 10MB' },
        { status: 400 }
      )
    }

    // 上传文件到 Moonshot
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('purpose', 'file-extract')

    console.log('开始上传文件到 Moonshot...')
    const uploadResponse = await fetch('https://api.moonshot.cn/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MOONSHOT_API_KEY}`
      },
      body: uploadFormData
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('文件上传失败:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText
      })
      throw new Error('文件上传失败')
    }

    const fileData = await uploadResponse.json()
    console.log('文件上传成功，开始提取内容...')

    // 获取文件内容
    const contentResponse = await fetch(`https://api.moonshot.cn/v1/files/${fileData.id}/content`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MOONSHOT_API_KEY}`
      }
    })

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text()
      console.error('获取文件内容失败:', {
        status: contentResponse.status,
        statusText: contentResponse.statusText,
        error: errorText
      })
      throw new Error('获取文件内容失败')
    }

    const content = await contentResponse.text()
    console.log('文件内容提取成功')
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('文件处理失败:', error)
    return NextResponse.json(
      { error: '文件处理失败，请稍后重试' },
      { status: 500 }
    )
  }
} 