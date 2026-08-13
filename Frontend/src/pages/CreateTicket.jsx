import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Bot,
  User,
  Mail,
  MessageSquare,
  Sparkles,
  Play,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { ApiError, createTicket, formatTicketId } from '../api/tickets'
import { createTicketSchema } from '../validation/ticketSchema'
import FieldError, { inputErrorClass } from '../components/FieldError'

export default function CreateTicket({ onSubmitSuccess }) {
  const [serverError, setServerError] = useState('')
  const [quotaExceeded, setQuotaExceeded] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(createTicketSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      question: '',
    },
  })

  const questionValue = watch('question') || ''
  const questionLen = questionValue.trim().length

  const showError = (field) =>
    Boolean(errors[field] && (touchedFields[field] || isSubmitted))

  const onSubmit = async (values) => {
    setServerError('')
    setQuotaExceeded(false)
    try {
      const ticket = await createTicket({
        customerName: values.name.trim(),
        email: values.email.trim(),
        question: values.question.trim(),
      })
      onSubmitSuccess?.({
        name: ticket.customerName,
        email: ticket.email,
        question: ticket.question,
        category: ticket.category,
        ticketId: formatTicketId(ticket.id),
        aiResponse: ticket.aiResponse,
      })
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setQuotaExceeded(true)
        setServerError('')
        return
      }
      setQuotaExceeded(false)
      setServerError(err.message || 'Unable to create ticket. Please try again.')
    }
  }

  if (quotaExceeded) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
            <AlertTriangle className="h-6 w-6 text-amber-600" strokeWidth={2.25} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-navy">
            Unable to generate AI response
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            AI service quota has been exceeded.
            <br />
            Please try again later.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuotaExceeded(false)
              setServerError('')
            }}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.25} />
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:p-8 md:p-10">
        <div className="mb-6 flex gap-3 sm:mb-8 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-icon-bg sm:h-12 sm:w-12">
            <Bot className="h-6 w-6 text-brand" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Create Support Ticket
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">
              Submit your question and our AI assistant will generate a response.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 sm:space-y-6"
        >
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-slate-600"
              >
                Customer Name
              </label>
              <div className="relative">
                <User
                  className={`pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${
                    showError('name') ? 'text-red-400' : 'text-slate-400'
                  }`}
                  strokeWidth={2}
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  disabled={isSubmitting}
                  aria-invalid={showError('name')}
                  aria-describedby={showError('name') ? 'name-error' : undefined}
                  placeholder="Jane Doe"
                  className={`w-full rounded-lg border bg-white py-2.5 pr-3 pl-10 text-sm text-navy placeholder:text-slate-400 outline-none transition focus:ring-2 disabled:opacity-60 ${inputErrorClass(showError('name'))}`}
                  {...register('name')}
                />
              </div>
              <FieldError id="name-error" message={showError('name') && errors.name?.message} />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-600"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${
                    showError('email') ? 'text-red-400' : 'text-slate-400'
                  }`}
                  strokeWidth={2}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={showError('email')}
                  aria-describedby={showError('email') ? 'email-error' : undefined}
                  placeholder="jane@example.com"
                  className={`w-full rounded-lg border bg-white py-2.5 pr-3 pl-10 text-sm text-navy placeholder:text-slate-400 outline-none transition focus:ring-2 disabled:opacity-60 ${inputErrorClass(showError('email'))}`}
                  {...register('email')}
                />
              </div>
              <FieldError id="email-error" message={showError('email') && errors.email?.message} />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label
                htmlFor="question"
                className="text-sm font-semibold text-slate-600"
              >
                Support Question
              </label>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand sm:text-sm">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                AI Assisted
              </span>
            </div>
            <div className="relative">
              <MessageSquare
                className={`pointer-events-none absolute top-3 left-3 h-4 w-4 ${
                  showError('question') ? 'text-red-400' : 'text-slate-400'
                }`}
                strokeWidth={2}
              />
              <textarea
                id="question"
                rows={5}
                disabled={isSubmitting}
                aria-invalid={showError('question')}
                aria-describedby={
                  showError('question') ? 'question-error' : 'question-hint'
                }
                placeholder="Describe the issue you're facing in detail..."
                className={`min-h-[120px] w-full resize-y rounded-lg border bg-white py-2.5 pr-3 pl-10 text-sm text-navy placeholder:text-slate-400 outline-none transition focus:ring-2 disabled:opacity-60 ${inputErrorClass(showError('question'))}`}
                {...register('question')}
              />
            </div>
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <FieldError
                id="question-error"
                message={showError('question') && errors.question?.message}
              />
              {!showError('question') && (
                <p id="question-hint" className="text-xs text-slate-400">
                  Min. 10 characters
                </p>
              )}
              <p
                className={`ml-auto shrink-0 text-xs tabular-nums ${
                  questionLen > 2000 ? 'font-semibold text-red-600' : 'text-slate-400'
                }`}
              >
                {questionLen}/2000
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  Submit Ticket
                  <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
