import { ImageResponse } from 'next/og'
import { getConfiguredCampusName } from './campus'

export const ogImageAlt = 'CampusFound — modernizing lost and found on campus'
export const ogImageSize = { width: 1200, height: 630 }
export const ogImagePath = '/brand/og.png'

export function createOgImageResponse(): ImageResponse {
  const campusName = getConfiguredCampusName()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FAF8F3',
          color: '#1B2A4A',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ height: 8, background: '#C9A227' }} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '64px 80px',
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 28,
              background: '#1B2A4A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(27, 42, 74, 0.18)',
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                border: '3px solid rgba(201, 162, 39, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  border: '4px solid #C9A227',
                  position: 'absolute',
                  top: 24,
                  left: 24,
                }}
              />
              <div
                style={{
                  width: 18,
                  height: 4,
                  background: '#C9A227',
                  position: 'absolute',
                  top: 46,
                  left: 46,
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
              maxWidth: 760,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-1px',
              }}
            >
              {campusName}
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 34,
                lineHeight: 1.3,
                color: '#4A5568',
                fontWeight: 500,
              }}
            >
              Modernizing lost & found on campus
            </div>
            <div
              style={{
                marginTop: 28,
                width: 220,
                height: 4,
                borderRadius: 2,
                background: '#C9A227',
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize },
  )
}
