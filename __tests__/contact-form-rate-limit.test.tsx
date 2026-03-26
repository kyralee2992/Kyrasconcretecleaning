/**
 * M1 — Rate limiting on contact form
 *
 * Red: form has no cooldown — rapid re-submission is possible
 * Green: second submit within cooldown window is blocked
 */
import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContactForm } from '../src/app/components/ContactForm'

// Mock next/navigation
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

// Silence fetch calls
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
})

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User', name: 'name' } })
  fireEvent.change(screen.getByLabelText(/email/i),    { target: { value: 'test@example.com', name: 'email' } })
  fireEvent.change(screen.getByLabelText(/phone/i),    { target: { value: '5035551234', name: 'phone' } })
  // service select — pick second option (first real option)
  const serviceSelect = screen.getByLabelText(/service needed/i)
  fireEvent.change(serviceSelect, { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
  fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
}

describe('ContactForm — rate limiting (M1)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    ;(global.fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('blocks a second submit within the cooldown window', async () => {
    render(<ContactForm />)

    // First submit — should go through
    await act(async () => { fillAndSubmit() })
    const firstCallCount = (global.fetch as jest.Mock).mock.calls.length

    // Re-render happens; submit again immediately (within cooldown)
    await act(async () => { fillAndSubmit() })
    const secondCallCount = (global.fetch as jest.Mock).mock.calls.length

    // fetch should NOT have been called a second time
    expect(secondCallCount).toBe(firstCallCount)
  })

  it('allows a submit after the cooldown window expires', async () => {
    render(<ContactForm />)

    await act(async () => { fillAndSubmit() })
    const afterFirst = (global.fetch as jest.Mock).mock.calls.length

    // Advance past the cooldown (3 s)
    act(() => { jest.advanceTimersByTime(3500) })

    await act(async () => { fillAndSubmit() })
    const afterSecond = (global.fetch as jest.Mock).mock.calls.length

    expect(afterSecond).toBeGreaterThan(afterFirst)
  })
})
