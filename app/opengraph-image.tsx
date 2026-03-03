import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = "Kyra Lee's Concrete Cleaning — Salem, Oregon"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const heroBuffer = fs.readFileSync(path.join(process.cwd(), 'public/og-hero.png'))
  const heroBase64 = `data:image/png;base64,${heroBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background hero image */}
        <img
          src={heroBase64}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '150%',
            height: '150%',
          }}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.35) 100%)',
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '10px',
            background: '#0EA5E9',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '72px 80px',
          }}
        >
          {/* Location badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#0EA5E9',
              borderRadius: '6px',
              padding: '8px 20px',
              marginBottom: '28px',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Salem, Oregon
            </span>
          </div>

          {/* Business name */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontSize: '86px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              KYRA LEE&apos;S
            </span>
            <span
              style={{
                fontSize: '86px',
                fontWeight: 900,
                color: '#0EA5E9',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              CONCRETE CLEANING
            </span>
          </div>

          {/* Services */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            {['Pressure Washing', 'Soft Washing', 'Driveways & Siding'].map((service) => (
              <div
                key={service}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: '#E2E8F0',
                  fontSize: '20px',
                }}
              >
                {service}
              </div>
            ))}
          </div>

          {/* CTA bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(14, 165, 233, 0.20)',
              border: '1px solid rgba(14, 165, 233, 0.5)',
              borderRadius: '10px',
              padding: '16px 28px',
            }}
          >
            <span
              style={{
                color: '#0EA5E9',
                fontSize: '26px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Free On-Site Quote
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '26px' }}>·</span>
            <span
              style={{
                color: 'white',
                fontSize: '26px',
                fontWeight: 600,
              }}
            >
              (971) 510-0926
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
