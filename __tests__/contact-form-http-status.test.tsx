/**
 * L3 — HTTP status code check on Web3Forms response
 *
 * Red: a non-2xx response with result.success=true would incorrectly be treated as success
 * Green: non-ok HTTP responses surface an error message regardless of body
 */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContactForm } from '../src/app/components/ContactForm'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/full name/i),      { target: { value: 'Test User', name: 'name' } })
  fireEvent.change(screen.getByLabelText(/email/i),          { target: { value: 'test@example.com', name: 'email' } })
  fireEvent.change(screen.getByLabelText(/phone/i),          { target: { value: '5035551234', name: 'phone' } })
  fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
  fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
}

describe('ContactForm — HTTP status check (L3)', () => {
  it('shows error on HTTP 500 even if body claims success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ success: true }),
    })

    render(<ContactForm />)
    await act(async () => fillAndSubmit())

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('shows error on HTTP 429 (rate limited by upstream)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ success: false }),
    })

    render(<ContactForm />)
    await act(async () => fillAndSubmit())

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})
