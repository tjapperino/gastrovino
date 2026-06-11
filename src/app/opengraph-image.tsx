import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Gastrovino Rotterdam — Wijn, Delicatessen & Rotterdamse Smaak'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          background:      'linear-gradient(135deg, #2C2416 0%, #71413D 100%)',
          gap:             24,
          padding:         60,
        }}
      >
        <div
          style={{
            fontSize:     14,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         '#B39662',
            fontWeight:    600,
          }}
        >
          Nieuwe Binnenweg 335A · Rotterdam
        </div>
        <div
          style={{
            fontSize:    72,
            fontWeight:  700,
            color:       '#FBF1DB',
            textAlign:   'center',
            lineHeight:  1.1,
          }}
        >
          Gastrovino Rotterdam
        </div>
        <div
          style={{
            fontSize:  28,
            color:     '#FBF1DB',
            opacity:   0.7,
            textAlign: 'center',
            maxWidth:  700,
          }}
        >
          Wijn · Delicatessen · Borrelplanken · Wijnproeverijen
        </div>
        <div
          style={{
            marginTop:  16,
            background: '#B39662',
            color:      '#2C2416',
            padding:    '10px 28px',
            borderRadius: 40,
            fontSize:   18,
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}
        >
          gastrovinorotterdam.nl
        </div>
      </div>
    ),
    { ...size },
  )
}
