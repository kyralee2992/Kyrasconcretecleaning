/**
 * M2 — Fetch timeout on Web3Forms call
 *
 * Red: fetch hangs forever — no AbortController timeout
 * Green: request is aborted after 10 s and user sees an error message
 */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContactForm } from '../src/app/components/ContactForm'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

describe('ContactForm — fetch timeout (M2)', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('shows an error message when the request times out', async () => {
    // fetch that never resolves (simulates a hung connection)
    global.fetch = jest.fn(
      (_url: RequestInfo | URL, opts?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          if (opts?.signal) {
            opts.signal.addEventListener('abort', () =>
              reject(new DOMException('The operation was aborted.', 'AbortError'))
            )
          }
        })
    ) as jest.Mock

    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/full name/i),    { target: { value: 'Test User', name: 'name' } })
    fireEvent.change(screen.getByLabelText(/email/i),        { target: { value: 'test@example.com', name: 'email' } })
    fireEvent.change(screen.getByLabelText(/phone/i),        { target: { value: '5035551234', name: 'phone' } })
    fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
    })

    // Advance past the 10 s timeout
    await act(async () => {
      jest.advanceTimersByTime(11000)
    })

    // An error message should now be visible
    expect(
      screen.getByText(/something went wrong|timed out|try again/i)
    ).toBeInTheDocument()
  })
})
