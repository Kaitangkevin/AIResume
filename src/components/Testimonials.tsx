import { StarIcon } from '@heroicons/react/20/solid'

const testimonials = [
  {
    content: "简历智评帮助我成功拿到了心仪的 offer！AI 的评分和建议非常专业。",
    author: {
      name: '张同学',
      role: '应届毕业生',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    rating: 5,
  },
  {
    content: "作为一个转行者，简历智评帮我快速调整了简历重点，突出了相关技能。",
    author: {
      name: '李同学',
      role: '转行求职者',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    rating: 5,
  },
  {
    content: "使用简历智评后，我的面试通过率提高了 40%。建议非常实用！",
    author: {
      name: '王同学',
      role: '在职求职者',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    rating: 5,
  },
  {
    content: "使用这个网站我发现我的简历得到了提升，并且能够告诉我为什么",
    author: {
      name: '唐同学',
      role: '在职求职者',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    rating: 5,
  },
  {
  content: "使用这个网站我发现我的简历得到了提升，并且能够告诉我为什么",
    author: {
      name: '何同学',
      role: '在职求职者',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    rating: 5,
  },
  {
    content: "使用这个网站我发现我的简历得到了提升，并且能够告诉我为什么",
    author: {
      name: '许同学',
      role: '在职求职者',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    rating: 5,
    },
]

export default function Testimonials() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-neon">用户评价</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            深受求职者信赖
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-900/50 p-8 text-sm leading-6">
                  <blockquote className="text-gray-300">
                    <p>{`"${testimonial.content}"`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-lg font-semibold text-neon">
                        {testimonial.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author.name}</div>
                      <div className="text-gray-400">{testimonial.author.role}</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-neon" aria-hidden="true" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 