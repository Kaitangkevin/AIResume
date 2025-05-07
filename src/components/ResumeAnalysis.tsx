'use client'

import { useState, useRef, useEffect } from 'react'
import { DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import PaymentModal from './PaymentModal'
import { motion } from 'framer-motion'

const jobPositions = [
  '产品经理',
  'UI设计师',
  '数据分析师',
  '运营专员',
  '软件工程师'
]

const industries = [
  '互联网',
  '金融',
  '教育',
  '医疗健康',
  '制造业',
  '其他'
]

interface ScoreResult {
  total: number
  details: {
    content: number
    skills: number
    language: number
    projects: number
    keywords: number
  }
  suggestions: string[]
}

export default function ResumeAnalysis() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 从 localStorage 恢复支付状态
  useEffect(() => {
    const savedPaymentStatus = localStorage.getItem('hasPaid')
    if (savedPaymentStatus === 'true') {
      setHasPaid(true)
    } else {
      setHasPaid(false)
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
      // 检查文件类型
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!validTypes.includes(file.type)) {
        setError('不支持的文件类型，请上传 PDF、Word 或 TXT 文件')
        return
      }

      // 检查文件大小（限制为 10MB）
      if (file.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过 10MB')
        return
      }

      setSelectedFile(file)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!validTypes.includes(file.type)) {
        setError('不支持的文件类型，请上传 PDF、Word 或 TXT 文件')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('文件大小不能超过 10MB')
        return
      }

      setSelectedFile(file)
      setError(null)
    }
  }

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!hasPaid) {
      setError('请先完成支付')
      return
    }

    if (!selectedIndustry || !selectedPosition) {
      setError('请选择目标行业和职位')
      return
    }

    if (!selectedFile && !resumeText) {
      setError('请上传简历文件或粘贴简历内容')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      let content = resumeText

      // 如果有文件，先提取文件内容
      if (selectedFile) {
        console.log('开始提取文件内容...')
        const formData = new FormData()
        formData.append('file', selectedFile)

        const extractResponse = await fetch('/api/extract', {
          method: 'POST',
          body: formData,
        })

        if (!extractResponse.ok) {
          const errorData = await extractResponse.json()
          throw new Error(errorData.error || '文件提取失败')
        }

        const extractData = await extractResponse.json()
        content = extractData.content
        console.log('文件内容提取成功')
      }

      // 调用 Moonshot API 进行简历分析
      console.log('开始分析简历...')
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetJob: selectedPosition,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.details?.includes('rate_limit_reached_error')) {
          throw new Error('服务器繁忙，请稍后再试')
        }
        throw new Error(errorData.error || '分析请求失败')
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      // 验证结果格式
      if (!result.score || !result.analysis || !result.keyword_analysis) {
        throw new Error('分析结果格式不正确')
      }

      console.log('分析完成，结果:', result)
      
      // 存储结果前先验证数据完整性
      const validatedResult = {
        score: {
          content_completeness: result.score.content_completeness || 0,
          job_match: result.score.job_match || 0,
          keyword_coverage: result.score.keyword_coverage || 0,
          project_description: result.score.project_description || 0,
          expression_quality: result.score.expression_quality || 0,
          total: result.score.total || 0
        },
        analysis: {
          strengths: Array.isArray(result.analysis.strengths) ? result.analysis.strengths : [],
          weaknesses: Array.isArray(result.analysis.weaknesses) ? result.analysis.weaknesses : [],
          suggestions: Array.isArray(result.analysis.suggestions) ? result.analysis.suggestions : []
        },
        keyword_analysis: {
          matched_keywords: Array.isArray(result.keyword_analysis.matched_keywords) ? result.keyword_analysis.matched_keywords : [],
          missing_keywords: Array.isArray(result.keyword_analysis.missing_keywords) ? result.keyword_analysis.missing_keywords : []
        }
      }

      // 存储验证后的结果
      localStorage.setItem('analysisResult', JSON.stringify(validatedResult))
      
      // 使用 replace 而不是 push，这样用户点击返回时不会回到分析页面
      router.replace('/result')
    } catch (error) {
      console.error('分析失败:', error)
      setError(error instanceof Error ? error.message : '分析失败，请稍后重试')
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
    <div id="resume-analysis" className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl py-32 sm:py-48 lg:py-56">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 左侧标题和说明 */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">智简简历分析</h2>
            <p className="mt-6 text-xl leading-8 text-gray-300">
              上传您的简历或粘贴内容，获取专业的 AI 评分和优化建议
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-dark font-bold">1</div>
                <p className="text-gray-300">上传简历或粘贴内容</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-dark font-bold">2</div>
                <p className="text-gray-300">选择目标行业和职位</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-dark font-bold">3</div>
                <p className="text-gray-300">支付 ¥3 获取分析</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-dark font-bold">4</div>
                <p className="text-gray-300">获取专业评分和建议</p>
              </div>
            </div>
          </div>

          {/* 右侧操作区域 */}
          <div className="bg-gray-800/50 rounded-2xl p-8">
            <form onSubmit={handleAnalyze} className="space-y-6" noValidate>
              {/* 输入方式切换 */}
              <div className="flex space-x-4 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    activeTab === 'upload' ? 'bg-neon text-dark' : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <DocumentArrowUpIcon className="h-5 w-5" />
                  <span>上传文件</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    activeTab === 'paste' ? 'bg-neon text-dark' : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>粘贴内容</span>
                </button>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="mb-4 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                  {error}
                </div>
              )}

              {/* 文件上传区域 */}
              {activeTab === 'upload' && (
                <div className="mt-4">
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>选择文件</span>
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
                      <p className="text-xs text-gray-500">支持 PDF、Word 和 TXT 格式，最大 10MB</p>
                    </div>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-400">
                      已选择: {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* 文本输入区域 */}
              {activeTab === 'paste' && (
                <div className="mt-4">
                  <textarea
                    rows={8}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-700"
                    placeholder="请粘贴您的简历内容..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>
              )}

              {/* 行业选择 */}
              <div className="mt-8">
                <label htmlFor="industry" className="block text-sm font-semibold leading-6 text-white">
                  选择行业
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-700"
                >
                  <option value="">请选择行业</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* 职位选择 */}
              <div className="mt-8">
                <label htmlFor="position" className="block text-sm font-semibold leading-6 text-white">
                  目标职位
                </label>
                <select
                  id="position"
                  name="position"
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-700"
                >
                  <option value="">请选择目标职位</option>
                  {jobPositions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              {/* 支付按钮 */}
              {!hasPaid && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-black bg-neon border border-transparent rounded-md shadow-sm hover:animate-glow transition-all"
                  >
                    扫码支付 ¥3
                  </button>
                </div>
              )}

              {/* 分析按钮 */}
              <div className="mt-6">
                <motion.button
                  type="submit"
                  disabled={isAnalyzing || !hasPaid}
                  className={`w-full px-4 py-2 text-sm font-medium text-black bg-[#c6ff00] border border-transparent rounded-md shadow-sm hover:bg-[#b3e600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c6ff00] ${
                    (!hasPaid || isAnalyzing) && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? '分析中...' : '开始评分'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
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