'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PaymentModal from './PaymentModal'

export default function ResumeForm() {
  const [hasPaid, setHasPaid] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resumeContent, setResumeContent] = useState('')
  const [targetPosition, setTargetPosition] = useState('')
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout | null>(null)

  // 从 localStorage 恢复支付状态
  useEffect(() => {
    const savedPaymentStatus = localStorage.getItem('hasPaid')
    if (savedPaymentStatus === 'true') {
      setHasPaid(true)
    }
  }, [])

  // 保存支付状态到 localStorage
  useEffect(() => {
    localStorage.setItem('hasPaid', hasPaid.toString())
  }, [hasPaid])

  // 处理支付超时
  useEffect(() => {
    if (showPaymentModal) {
      const timeout = setTimeout(() => {
        setShowPaymentModal(false)
        setError('支付超时，请重新尝试')
      }, 5 * 60 * 1000) // 5分钟超时
      setPaymentTimeout(timeout)
    } else if (paymentTimeout) {
      clearTimeout(paymentTimeout)
      setPaymentTimeout(null)
    }
  }, [showPaymentModal])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过10MB')
        return
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        setError('仅支持 PDF、Word 和 TXT 格式')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过10MB')
        return
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        setError('仅支持 PDF、Word 和 TXT 格式')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!hasPaid) {
      setShowPaymentModal(true)
      return
    }

    if (!selectedFile && !resumeContent) {
      setError('请上传简历文件或粘贴简历内容')
      return
    }

    if (!targetPosition) {
      setError('请选择目标职位')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      let content = resumeContent

      if (selectedFile) {
        // 调用 Moonshot API 提取文件内容
        const formData = new FormData()
        formData.append('file', selectedFile)

        const extractResponse = await fetch('https://api.moonshot.cn/v1/files/extract', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MOONSHOT_API_KEY}`
          },
          body: formData
        })

        if (!extractResponse.ok) {
          throw new Error('文件内容提取失败')
        }

        const extractResult = await extractResponse.json()
        content = extractResult.content
      }

      // 调用 Moonshot API 进行简历分析
      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MOONSHOT_API_KEY}`
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的简历分析专家，请对简历进行评分和分析。'
            },
            {
              role: 'user',
              content: `请分析以下简历内容，并给出评分和建议。目标职位：${targetPosition}\n\n简历内容：${content}`
            }
          ],
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('简历分析失败')
      }

      const result = await response.json()
      const analysis = result.choices[0].message.content

      // 将分析结果保存到 localStorage
      localStorage.setItem('resumeAnalysis', analysis)

      // 跳转到结果页面
      window.location.href = '/result'
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中出现错误')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePaymentConfirmed = () => {
    setHasPaid(true)
    setShowPaymentModal(false)
    if (paymentTimeout) {
      clearTimeout(paymentTimeout)
      setPaymentTimeout(null)
    }
  }

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl"
          >
            智简简历分析
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            上传您的简历或粘贴内容，获取专业的 AI 评分和优化建议
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <div className="space-y-6">
            {/* 文件上传区域 */}
            <div
              className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6 text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>上传文件</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                  <p className="pl-1">或拖放文件到此处</p>
                </div>
                <p className="text-xs leading-5 text-gray-400">支持 PDF、Word 和 TXT 格式，最大 10MB</p>
              </div>
            </div>

            {/* 目标职位选择 */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium leading-6 text-white">
                目标职位
              </label>
              <select
                id="position"
                name="position"
                className="mt-2 block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
              >
                <option value="">请选择目标职位</option>
                <option value="前端开发工程师">前端开发工程师</option>
                <option value="后端开发工程师">后端开发工程师</option>
                <option value="全栈开发工程师">全栈开发工程师</option>
                <option value="产品经理">产品经理</option>
                <option value="UI设计师">UI设计师</option>
                <option value="运营专员">运营专员</option>
                <option value="市场营销">市场营销</option>
                <option value="人力资源">人力资源</option>
                <option value="财务">财务</option>
                <option value="销售">销售</option>
              </select>
            </div>

            {/* 简历内容输入 */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium leading-6 text-white">
                简历内容
              </label>
              <div className="mt-2">
                <textarea
                  id="resume"
                  name="resume"
                  rows={6}
                  className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="或者直接粘贴简历内容..."
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-md bg-red-500/10 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-400">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* 支付按钮 */}
            {!hasPaid && (
              <button
                type="button"
                className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setShowPaymentModal(true)}
              >
                立即支付 ¥3
              </button>
            )}

            {/* 分析按钮 */}
            <button
              type="button"
              className={`w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                hasPaid
                  ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
              onClick={handleAnalyze}
              disabled={!hasPaid || isAnalyzing}
            >
              {isAnalyzing ? '分析中...' : '开始评分'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* 支付模态框 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </div>
  )
} 