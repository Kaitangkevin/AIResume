'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const faqs = [
  {
    question: '支持哪些类型的简历？',
    answer: '我们支持 PDF、Word、TXT 等多种格式的简历文件。同时也支持在线编辑和直接粘贴文本内容。'
  },
  {
    question: '是否会保存我的数据？',
    answer: '我们非常重视用户隐私。您的简历数据仅用于评分分析，不会用于其他用途。您可以随时删除您的数据。'
  },
  {
    question: '结果多久可以看到？',
    answer: '一般情况下，AI 评分结果会在 30 秒内生成。具体时间取决于简历长度和系统负载。'
  },
  {
    question: '评分标准是什么？',
    answer: '我们的评分系统从内容完整性、语言表达、关键词匹配、格式规范、职业相关性等五个维度进行评估。'
  },
  {
    question: '如何获取更详细的优化建议？',
    answer: '在基础评分后，您可以点击"查看详细报告"获取针对性的优化建议，包括具体修改意见和示例。'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-800">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-white">常见问题</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-800">
            {faqs.map((faq, index) => (
              <div key={index} className="pt-6">
                <dt>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between text-left text-white"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDownIcon
                        className={`h-6 w-6 transform transition-transform ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </dt>
                {openIndex === index && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base leading-7 text-gray-300">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 