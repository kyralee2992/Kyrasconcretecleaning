import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Kyra Lee's Concrete Cleaning — Salem, Oregon"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F172A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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

        {/* Background water droplet watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            top: '-60px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'rgba(14, 165, 233, 0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '60px',
            bottom: '-80px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'rgba(14, 165, 233, 0.04)',
          }}
        />

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
            KYRA LEE'S
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
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '8px 16px',
                color: '#94A3B8',
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
            background: 'rgba(14, 165, 233, 0.15)',
            border: '1px solid rgba(14, 165, 233, 0.4)',
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
          <span style={{ color: '#475569', fontSize: '26px' }}>·</span>
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
    ),
    { ...size }
  )
}
