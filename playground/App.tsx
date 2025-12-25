import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToast,
} from '@/components'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Toast Examples</h1>
        <p className="text-white/90 text-center mb-8">
          Click the buttons below to see different toast notifications
        </p>

        <Toast>
          <div className="flex flex-wrap gap-4 justify-center">
            <ToastButton type="success" />
            <ToastButton type="error" />
            <ToastButton type="info" />
            <ToastButton type="warning" />
          </div>

          <ToastPortal>
            <ToastViewport className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
              <ToastList />
            </ToastViewport>
          </ToastPortal>
        </Toast>
      </div>
    </div>
  )
}

function ToastButton({ type = 'success' }: { type?: 'success' | 'error' | 'info' | 'warning' }) {
  const toast = useToast()

  const configs = {
    success: {
      title: 'Success',
      description: 'Your action was completed successfully!',
      type: 'success' as const,
    },
    error: {
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      type: 'error' as const,
    },
    info: {
      title: 'Information',
      description: 'Here is some useful information for you.',
      type: 'info' as const,
    },
    warning: {
      title: 'Warning',
      description: 'Please review this important warning.',
      type: 'warning' as const,
    },
  }

  const config = configs[type]

  return (
    <button
      type="button"
      onClick={() => {
        toast.add(config)
      }}
      className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow hover:bg-gray-50 active:scale-95"
    >
      Show {type.charAt(0).toUpperCase() + type.slice(1)} Toast
    </button>
  )
}

function ToastList() {
  const toast = useToast()

  const getTypeStyles = (type?: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  return toast.toasts.map((toastItem) => (
    <ToastRoot
      key={toastItem.id}
      toast={toastItem}
      className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all hover:shadow-xl ${getTypeStyles(toastItem.type)}`}
    >
      <ToastContent className="flex-1">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <ToastTitle className="text-sm font-semibold text-gray-900">
              {toastItem.title}
            </ToastTitle>
            {toastItem.description && (
              <ToastDescription className="text-sm text-gray-600">
                {toastItem.description}
              </ToastDescription>
            )}
          </div>
        </div>
      </ToastContent>
      <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-gray-400/50 opacity-0 transition-opacity hover:text-gray-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 group-hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </ToastClose>
    </ToastRoot>
  ))
}

export default App
