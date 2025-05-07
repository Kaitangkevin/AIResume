'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: '首页', href: '/' },
  { name: '功能介绍', href: '#features' },
  { name: '使用流程', href: '#process' },
  { name: '关于我们', href: '#about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNavigation = (href: string) => {
    if (!isClient) return

    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    } else if (href === '/' || href === '#') {
      router.push('/')
      // 等待页面加载完成后滚动到 ResumeAnalysis 组件
      setTimeout(() => {
        const element = document.querySelector('#resume-analysis')
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    } else {
      router.push(href)
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-dark/80 backdrop-blur-sm">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">智简</span>
            <img
              src="/image.png"
              alt="智简 Logo"
              className="h-8 w-auto"
            />
            <div className="text-2xl font-bold text-white">智简</div>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">打开主菜单</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className="text-sm font-semibold leading-6 text-white hover:text-neon transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={() => handleNavigation('#')}
            className="rounded-full bg-neon px-6 py-2.5 text-sm font-semibold text-dark shadow-sm hover:animate-glow transition-all"
          >
            立即体验
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-dark px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <img
                src="/image.png"
                alt="智简 Logo"
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-neon">智简</span>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">关闭菜单</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <button
                  onClick={() => handleNavigation('#')}
                  className="block w-full rounded-full bg-neon px-6 py-2.5 text-center text-sm font-semibold text-dark shadow-sm hover:animate-glow transition-all"
                >
                  立即体验
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 