type Tone = 'success' | 'error' | 'info'

interface Toast {
  id: number
  title: string
  tone: Tone
}

interface Toaster {
  toasts: Ref<Toast[]>
  success: (title: string) => void
  error: (title: string) => void
  info: (title: string) => void
  fail: (error: unknown) => void
  dismiss: (id: number) => void
}

const FALLBACK = 'Algo deu errado. Tente novamente.'

function messageOf(error: unknown): string {
  if (!error || typeof error !== 'object' || !('data' in error)) return FALLBACK
  const { data } = error
  if (!data || typeof data !== 'object' || !('message' in data)) return FALLBACK
  return typeof data.message === 'string' && data.message ? data.message : FALLBACK
}

function useToast(): Toaster {
  const toasts = useState<Toast[]>('toasts', () => [])
  const counter = useState('toast-counter', () => 0)

  function push(title: string, tone: Tone): void {
    counter.value += 1
    toasts.value = [...toasts.value, { id: counter.value, title, tone }]
  }

  function dismiss(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    success: (title) => {
      push(title, 'success')
    },
    error: (title) => {
      push(title, 'error')
    },
    info: (title) => {
      push(title, 'info')
    },
    fail: (error) => {
      push(messageOf(error), 'error')
    },
    dismiss,
  }
}

export type { Toast }
export { useToast }
