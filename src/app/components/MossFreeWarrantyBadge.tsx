import { Shield, Droplet } from 'lucide-react';

export function MossFreeWarrantyBadge() {
  return (
    <div 
      className="inline-flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm"
      style={{ 
        backgroundColor: 'rgba(34, 197, 94, 0.95)',
        border: '2px solid white',
        maxWidth: '280px'
      }}
    >
      {/* Shield Icon with Crossed Droplet */}
      <div className="relative flex-shrink-0 pt-1">
        <Shield 
          className="w-8 h-8" 
          style={{ color: 'white' }}
          fill="white"
          strokeWidth={2}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Droplet 
              className="w-4 h-4" 
              style={{ color: '#22C55E' }}
              fill="#22C55E"
              strokeWidth={0}
            />
            {/* Diagonal line crossing out the droplet */}
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              style={{ transform: 'rotate(45deg)' }}
            >
              <div 
                style={{ 
                  width: '1px', 
                  height: '18px', 
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 2px rgba(34, 197, 94, 0.5)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-0.5">
        <p 
          className="text-xs tracking-wide uppercase leading-tight"
          style={{ 
            fontFamily: 'Oswald, sans-serif', 
            fontWeight: 700,
            color: 'white'
          }}
        >
          12-Month Moss-Free<br />Guarantee
        </p>
        <p 
          className="text-xs leading-tight"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: 'white'
          }}
        >
          If it comes back, so do we.
        </p>
      </div>
    </div>
  );
}
