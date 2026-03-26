/**
 * H1/H2 — Security headers + CSP
 *
 * These tests verify that next.config.ts returns the required security headers
 * for every route. They must FAIL before the headers are added (Red),
 * and PASS after (Green).
 */
import nextConfig from '../next.config'

const REQUIRED_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

const CSP_REQUIRED_DIRECTIVES = [
  "default-src 'self'",
  'connect-src',
  'api.web3forms.com',
  "frame-ancestors 'none'",
]

async function getHeadersForPath(path = '/'): Promise<Record<string, string>> {
  if (typeof nextConfig.headers !== 'function') {
    throw new Error('next.config.ts must export a headers() function')
  }
  const allRules = await nextConfig.headers()
  const matched = allRules.find((rule) => {
    // source '/(.*)'  matches everything
    return rule.source === '/' || rule.source === '/(.*)'
  })
  if (!matched) {
    throw new Error(`No header rule found matching path "${path}"`)
  }
  return Object.fromEntries(matched.headers.map((h) => [h.key, h.value]))
}

describe('Security Headers (H1/H2)', () => {
  let headers: Record<string, string>

  beforeAll(async () => {
    headers = await getHeadersForPath('/')
  })

  for (const [key, expectedValue] of Object.entries(REQUIRED_HEADERS)) {
    it(`sets ${key}`, () => {
      expect(headers[key]).toBe(expectedValue)
    })
  }

  it('sets Content-Security-Policy header', () => {
    expect(headers['Content-Security-Policy']).toBeDefined()
  })

  for (const directive of CSP_REQUIRED_DIRECTIVES) {
    it(`CSP includes "${directive}"`, () => {
      expect(headers['Content-Security-Policy']).toContain(directive)
    })
  }
})
