import { z } from 'zod'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const createTicketSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Customer name is required.')
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must be 80 characters or less.')
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, 'Name can only include letters, spaces, and . \' -'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .max(120, 'Email must be 120 characters or less.')
    .regex(EMAIL_REGEX, 'Enter a valid email address (e.g. jane@example.com).'),
  question: z
    .string()
    .trim()
    .min(1, 'Support question is required.')
    .min(10, 'Please describe the issue in at least 10 characters.')
    .max(2000, 'Question must be 2000 characters or less.'),
})
