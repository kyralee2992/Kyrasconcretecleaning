/**
 * M3 — Phone number format validation
 *
 * Red: any non-empty string passes phone validation
 * Green: only strings with ≥10 digits are accepted
 */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContactForm } from '../src/app/components/ContactForm'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })

function submitWithPhone(phone: string) {
  fireEvent.change(screen.getByLabelText(/full name/i),    { target: { value: 'Test User', name: 'name' } })
  fireEvent.change(screen.getByLabelText(/email/i),        { target: { value: 'test@example.com', name: 'email' } })
  fireEvent.change(screen.getByLabelText(/phone/i),        { target: { value: phone, name: 'phone' } })
  fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
  fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
}

describe('ContactForm — phone validation (M3)', () => {
  it('rejects a phone number that is too short', async () => {
    render(<ContactForm />)
    await act(async () => submitWithPhone('123'))
    expect(screen.getByText(/valid phone/i)).toBeInTheDocument()
  })

  it('rejects a phone number with only non-digit characters', async () => {
    render(<ContactForm />)
    await act(async () => submitWithPhone('abcdefghij'))
    expect(screen.getByText(/valid phone/i)).toBeInTheDocument()
  })

  it('accepts a standard US phone number', async () => {
    render(<ContactForm />)
    await act(async () => submitWithPhone('(503) 555-1234'))
    expect(screen.queryByText(/valid phone/i)).not.toBeInTheDocument()
  })

  it('accepts a 10-digit phone number without formatting', async () => {
    render(<ContactForm />)
    await act(async () => submitWithPhone('5035551234'))
    expect(screen.queryByText(/valid phone/i)).not.toBeInTheDocument()
  })
})
