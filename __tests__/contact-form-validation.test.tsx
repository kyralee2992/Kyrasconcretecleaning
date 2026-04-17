/**
 * Validation + success-path coverage
 *
 * Covers uncovered branches in ContactForm.tsx:
 *   - empty name (line 44)
 *   - empty email (line 48)
 *   - invalid email format (line 50)
 *   - empty phone (line 54)
 *   - empty serviceType (line 60)
 *   - result.success === false path (line 105)
 *   - handleChange clears a pre-existing error (line 120)
 *   - successful submission navigates to /thank-you
 */
import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ContactForm } from '../src/app/components/ContactForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

// ── helpers ──────────────────────────────────────────────────────────────────

function fillValid() {
  fireEvent.change(screen.getByLabelText(/full name/i),      { target: { value: 'Jane Doe',           name: 'name'        } })
  fireEvent.change(screen.getByLabelText(/email/i),          { target: { value: 'jane@example.com',   name: 'email'       } })
  fireEvent.change(screen.getByLabelText(/phone/i),          { target: { value: '5035551234',          name: 'phone'       } })
  fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
}

function clickSubmit() {
  fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
}

// ── Empty-field validation ────────────────────────────────────────────────────

describe('ContactForm — required field validation', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('shows "Name is required" when name is empty', async () => {
    render(<ContactForm />)
    // leave name blank, fill everything else
    fireEvent.change(screen.getByLabelText(/email/i),          { target: { value: 'jane@example.com',     name: 'email'       } })
    fireEvent.change(screen.getByLabelText(/phone/i),          { target: { value: '5035551234',            name: 'phone'       } })
    fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
    await act(async () => clickSubmit())
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows "Email is required" when email is empty', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/full name/i),      { target: { value: 'Jane Doe',              name: 'name'        } })
    fireEvent.change(screen.getByLabelText(/phone/i),          { target: { value: '5035551234',            name: 'phone'       } })
    fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
    await act(async () => clickSubmit())
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows invalid-email message for a malformed email', async () => {
    // React 18 does NOT fire synthetic onChange for type=email when the
    // browser considers the value invalid (typeMismatch). Use a value that
    // passes browser HTML5 email validation (no typeMismatch) but fails the
    // stricter custom regex — e.g. "user@localhost" has no dot in the domain.
    render(<ContactForm />)
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/full name/i),      { target: { value: 'Jane Doe',              name: 'name'        } })
      fireEvent.change(screen.getByLabelText(/email/i),          { target: { value: 'user@localhost',        name: 'email'       } })
      fireEvent.change(screen.getByLabelText(/phone/i),          { target: { value: '5035551234',            name: 'phone'       } })
      fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
    })
    await act(async () => clickSubmit())
    expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows "Phone number is required" when phone is empty', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/full name/i),      { target: { value: 'Jane Doe',              name: 'name'        } })
    fireEvent.change(screen.getByLabelText(/email/i),          { target: { value: 'jane@example.com',     name: 'email'       } })
    fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
    await act(async () => clickSubmit())
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows "Please select a service" when serviceType is empty', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe',          name: 'name'  } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'jane@example.com', name: 'email' } })
    fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '5035551234',        name: 'phone' } })
    // leave serviceType as default empty string
    await act(async () => clickSubmit())
    expect(screen.getByText(/please select a service/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

// ── Submission success & failure ──────────────────────────────────────────────

describe('ContactForm — submission outcomes', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('navigates to /thank-you on successful submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    render(<ContactForm />)
    await act(async () => {
      fillValid()
      clickSubmit()
    })
    expect(mockPush).toHaveBeenCalledWith('/thank-you')
  })

  it('shows error when both /api/leads and web3forms fail', async () => {
    // /api/leads returns !ok AND web3forms returns {ok:true, success:false}
    global.fetch = jest.fn().mockImplementation((url: RequestInfo | URL) => {
      const u = typeof url === 'string' ? url : url.toString()
      if (u.includes('/api/leads')) {
        return Promise.resolve({ ok: false, status: 500, json: async () => ({}) })
      }
      return Promise.resolve({ ok: true, json: async () => ({ success: false }) })
    }) as jest.Mock
    render(<ContactForm />)
    await act(async () => {
      fillValid()
      clickSubmit()
    })
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })
})

// ── handleChange clears errors ────────────────────────────────────────────────

describe('ContactForm — error clearing on input change', () => {
  it('clears the name error as soon as the user starts typing', async () => {
    global.fetch = jest.fn()
    render(<ContactForm />)

    // 1. Trigger validation error by submitting with blank name
    fireEvent.change(screen.getByLabelText(/email/i),          { target: { value: 'jane@example.com',     name: 'email'       } })
    fireEvent.change(screen.getByLabelText(/phone/i),          { target: { value: '5035551234',            name: 'phone'       } })
    fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'Soft Washing (Siding)', name: 'serviceType' } })
    await act(async () => clickSubmit())
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()

    // 2. Start typing in name — error should disappear
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'J', name: 'name' } })
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
  })
})
