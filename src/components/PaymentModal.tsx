'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import './globals.css'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentConfirmed: () => void
}

export default function PaymentModal({ isOpen, onClose, onPaymentConfirmed }: PaymentModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-gray-900 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-white mb-8">
                      扫码支付 ¥3
                    </Dialog.Title>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="relative w-48 h-48 mx-auto mb-2">
                          <Image
                            src="/wechat-qr.png"
                            alt="微信支付"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-400">微信支付</p>
                      </div>
                      <div className="text-center">
                        <div className="relative w-48 h-48 mx-auto mb-2">
                          <Image
                            src="/alipay-qr.png"
                            alt="支付宝"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-400">支付宝</p>
                      </div>
                    </div>
                    <div className="mt-8">
                      <button
                        type="button"
                        className="w-full rounded-md bg-neon px-3.5 py-2.5 text-sm font-semibold text-dark shadow-sm hover:animate-glow transition-all"
                        onClick={onPaymentConfirmed}
                      >
                        我已支付
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 