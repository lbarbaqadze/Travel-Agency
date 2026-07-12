interface AuthAlertProps {
  message?: string
  variant?: 'error' | 'success'
}

export default function AuthAlert({ message, variant = 'error' }: AuthAlertProps) {
  if (!message) return null;

  const styles =
    variant === 'error'
      ? 'text-red-500 bg-red-50 border-red-100 shadow-red-500/10'
      : 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/10'

  return (
    <div 
      className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300 ease-out"
      aria-live="polite"
    >
      <div className={`flex items-center justify-center px-4 py-3 border rounded-xl shadow-lg ${styles}`}>
        <p className="text-xs font-bold tracking-wide text-center">{message}</p>
      </div>
    </div>
  )
}