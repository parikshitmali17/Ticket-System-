import { AlertCircle } from 'lucide-react'

export default function FieldError({ id, message }) {
  if (!message) return null

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600 sm:text-sm"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      <span>{message}</span>
    </p>
  )
}

export function inputErrorClass(hasError) {
  return hasError
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : 'border-border focus:border-brand focus:ring-brand/20'
}
