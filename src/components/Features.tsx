import { DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'AI智能评分',
    description: '从内容完整度、语言表达、关键词覆盖等五个维度评估',
    icon: ChartBarIcon,
  },
  {
    name: '个性化优化建议',
    description: '根据职位类型，定制具体修改建议',
    icon: DocumentTextIcon,
  },
]

export default function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Demo Section */}
        <div className="mx-auto max-w-2xl lg:mx-0 mb-32">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">智能简历评分系统</h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            上传您的简历，获取专业的 AI 评分和优化建议
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="bg-gray-900/50 p-8 rounded-2xl">
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">评分结果预览</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-neon to-purple-600 opacity-20 blur"></div>
              <div className="relative bg-gray-900/50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">在线体验</h3>
                <p className="text-gray-300">立即上传简历，体验 AI 智能评分系统</p>
                <button className="mt-4 rounded-full bg-neon px-6 py-2 text-sm font-semibold text-dark shadow-sm hover:animate-glow transition-all">
                  开始体验
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-32 max-w-2xl sm:mt-40 lg:mt-56 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-16 text-center">
            为什么选择简历智评？
          </h2>
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col group hover:scale-105 transition-transform">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-neon group-hover:animate-pulse" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 