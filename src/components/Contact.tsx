'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, QrCodeIcon } from '@heroicons/react/24/outline'

const contactInfo = [
  {
    name: '邮箱',
    description: 'contact@resume-ai.com',
    icon: EnvelopeIcon,
  },
  {
    name: '电话',
    description: '+86 13800138000',
    icon: PhoneIcon,
  },
  {
    name: '小红书',
    description: 'HiTec',
    icon: QrCodeIcon,
  },
]

const resumeTypes = [
  '应届生简历',
  '社招简历',
  '转行简历',
  '其他类型'
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resumeType: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理表单提交逻辑
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">联系我们</h2>
          <p className="mt-2 text-lg leading-8 text-gray-300">
            有任何问题或建议？请随时与我们联系。
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {contactInfo.map((item) => (
            <div key={item.name}>
              <dt className="font-semibold text-white">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-neon">
                  <item.icon className="h-6 w-6 text-dark" aria-hidden="true" />
                </div>
                {item.name}
              </dt>
              <dd className="mt-1 text-gray-300">{item.description}</dd>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white">
                姓名
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-800"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white">
                邮箱
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-800"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="resumeType" className="block text-sm font-semibold leading-6 text-white">
                简历类型
              </label>
              <div className="mt-2.5">
                <select
                  name="resumeType"
                  id="resumeType"
                  value={formData.resumeType}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-800"
                >
                  <option value="">请选择简历类型</option>
                  {resumeTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white">
                留言内容
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neon sm:text-sm sm:leading-6 bg-gray-800"
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-neon px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-neon/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
            >
              发送消息
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 