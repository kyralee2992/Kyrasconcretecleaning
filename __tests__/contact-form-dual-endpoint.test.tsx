/**
 * ContactForm dual-endpoint integration — Phase 2b
 *
 * Verifies the form fires BOTH /api/leads and api.web3forms.com in parallel
 * and redirects if EITHER succeeds (belt-and-suspenders: owner-chosen option a).
 */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContactForm } from '../src/app/components/ContactForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: (path: string) => mockPush(path) }),
}))

type FetchImpl = (url: RequestInfo | URL, init?: RequestInit) => Promise<unknown>

function mockFetch(impl: FetchImpl) {
  global.fetch = jest.fn().mockImplementation(impl) as jest.Mock
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'Jane Doe', name: 'name' },
  })
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'jane@example.com', name: 'email' },
  })
  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '5035551234', name: 'phone' },
  })
  fireEvent.change(screen.getByLabelText(/service needed/i), {
    target: { value: 'Soft Washing (Siding)', name: 'serviceType' },
  })
  fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
}

function urlOf(u: RequestInfo | URL): string {
  return typeof u === 'string' ? u : u.toString()
}

describe('ContactForm — dual-endpoint submission (Phase 2b)', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('fires BOTH /api/leads and web3forms on a single submit', async () => {
    const urlsHit: string[] = []
    mockFetch(async (url) => {
      urlsHit.push(urlOf(url))
      return { ok: true, json: async () => ({ success: true }) }
    })

    render(<ContactForm />)
    await act(async () => fillAndSubmit())

    expect(urlsHit).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/api/leads'),
        expect.stringContaining('api.web3forms.com'),
      ]),
    )
    expect(urlsHit).toHaveLength(2)
  })

  it('redirects when both endpoints succeed', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ success: true }) }))
    render(<ContactForm />)
    await act(async () => fillAndSubmit())
    expect(mockPush).toHaveBeenCalledWith('/thank-you')
  })

  it('redirects when only /api/leads succeeds (web3forms down)', async () => {
    mockFetch(async (url) => {
      if (urlOf(url).includes('/api/leads')) {
        return { ok: true, json: async () => ({}) }
      }
      return { ok: false, status: 500, json: async () => ({ success: false }) }
    })
    render(<ContactForm />)
    await act(async () => fillAndSubmit())
    expect(mockPush).toHaveBeenCalledWith('/thank-you')
  })

  it('redirects when only web3forms succeeds (/api/leads down)', async () => {
    mockFetch(async (url) => {
      if (urlOf(url).includes('/api/leads')) {
        return { ok: false, status: 500, json: async () => ({}) }
      }
      return { ok: true, json: async () => ({ success: true }) }
    })
    render(<ContactForm />)
    await act(async () => fillAndSubmit())
    expect(mockPush).toHaveBeenCalledWith('/thank-you')
  })

  it('sends the full lead payload (including optional fields) to /api/leads', async () => {
    let leadsBody: Record<string, unknown> | null = null
    mockFetch(async (url, init) => {
      if (urlOf(url).includes('/api/leads') && init?.body) {
        leadsBody = JSON.parse(init.body as string)
      }
      return { ok: true, json: async () => ({ success: true }) }
    })

    render(<ContactForm />)

    // Fill a few optional fields too
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jane Doe', name: 'name' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jane@example.com', name: 'email' },
    })
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '5035551234', name: 'phone' },
    })
    fireEvent.change(screen.getByLabelText(/service needed/i), {
      target: { value: 'Deep Cleaning (Concrete)', name: 'serviceType' },
    })
    fireEvent.change(screen.getByLabelText(/property address/i), {
      target: { value: '456 Liberty St NE', name: 'address' },
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /book my free walkthrough/i }))
    })

    expect(leadsBody).not.toBeNull()
    expect(leadsBody!.email).toBe('jane@example.com')
    expect(leadsBody!.serviceType).toBe('Deep Cleaning (Concrete)')
    expect(leadsBody!.address).toBe('456 Liberty St NE')
    // /api/leads body MUST NOT carry the web3forms access key
    expect(leadsBody).not.toHaveProperty('access_key')
  })
})
