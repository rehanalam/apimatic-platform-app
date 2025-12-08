import * as React from 'react'
import { toast as toastify, ToastContainer, type ToastOptions } from 'react-toastify'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import 'react-toastify/dist/ReactToastify.css'

export interface ToastProps {
  message: string
  action?: () => void
  actionLabel?: string
  icon?: React.ReactNode
}

const CloseButton = ({ closeToast }: any) => (
  <button
    onClick={closeToast}
    className="text-current opacity-70 hover:opacity-100 transition-opacity"
    aria-label="Close"
  >
    <X className="h-4 w-4" />
  </button>
)

const toastConfig: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  closeButton: CloseButton,
  className: 'bg-background text-foreground border border-border rounded-md shadow-lg',
  bodyClassName: 'text-sm',
  progressClassName: 'bg-primary',
}

const ToastContent = ({ message, action, actionLabel, icon }: ToastProps) => (
  <div className="flex items-center gap-3">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div className="flex-1 text-sm">{message}</div>
    {action && actionLabel && (
      <button
        onClick={action}
        className="flex-shrink-0 px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
)

export const toast = {
  success: (props: ToastProps | string) => {
    const config = typeof props === 'string' ? { message: props } : props
    return toastify.success(
      <ToastContent
        {...config}
        icon={config.icon || <CheckCircle2 className="h-5 w-5 text-green-500" />}
      />,
      toastConfig
    )
  },

  error: (props: ToastProps | string) => {
    const config = typeof props === 'string' ? { message: props } : props
    return toastify.error(
      <ToastContent
        {...config}
        icon={config.icon || <XCircle className="h-5 w-5 text-destructive" />}
      />,
      toastConfig
    )
  },

  warning: (props: ToastProps | string) => {
    const config = typeof props === 'string' ? { message: props } : props
    return toastify.warning(
      <ToastContent
        {...config}
        icon={config.icon || <AlertCircle className="h-5 w-5 text-yellow-500" />}
      />,
      toastConfig
    )
  },

  info: (props: ToastProps | string) => {
    const config = typeof props === 'string' ? { message: props } : props
    return toastify.info(
      <ToastContent
        {...config}
        icon={config.icon || <Info className="h-5 w-5 text-blue-500" />}
      />,
      toastConfig
    )
  },

  default: (props: ToastProps | string) => {
    const config = typeof props === 'string' ? { message: props } : props
    return toastify(<ToastContent {...config} />, toastConfig)
  },
}

export function ToastProvider({ className }: { className?: string }) {
  return (
    <ToastContainer
      className={cn('!w-auto !min-w-[320px] !max-w-[500px]', className)}
      toastClassName="!bg-background !text-foreground !border !border-border !rounded-md !shadow-lg !mb-2"
      bodyClassName="!text-sm !p-0"
      progressClassName="!bg-primary"
    />
  )
}
