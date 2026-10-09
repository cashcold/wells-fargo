import React from 'react';

export interface WfLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'red' | 'gold' | 'dark' | 'app-icon' | 'badge-only';
  showStagecoach?: boolean;
  showBox?: boolean;
  subtitle?: string;
}

export const WfLogo: React.FC<WfLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'white',
  showStagecoach = true,
  showBox = true,
  subtitle,
}) => {
  // Dimension tokens
  const dimensions = {
    xs: { box: 22, text: 'text-xs', coachW: 24, coachH: 16 },
    sm: { box: 28, text: 'text-sm', coachW: 30, coachH: 20 },
    md: { box: 36, text: 'text-xl', coachW: 42, coachH: 26 },
    lg: { box: 48, text: 'text-2xl', coachW: 54, coachH: 34 },
    xl: { box: 64, text: 'text-3xl', coachW: 72, coachH: 46 },
  }[size];

  const colorClasses = {
    white: 'text-white',
    red: 'text-[#d71e28]',
    gold: 'text-[#ffcc00]',
    dark: 'text-stone-900',
    'app-icon': 'text-white',
    'badge-only': 'text-white',
  }[variant];

  // If app-icon variant is requested, render the full Android/iOS style Wells Fargo Mobile App Icon
  if (variant === 'app-icon') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center select-none ${className}`}
        title="Wells Fargo Mobile App Icon"
      >
        <div
          className="relative rounded-2xl bg-gradient-to-b from-[#e0202a] to-[#b8151f] shadow-lg flex flex-col items-center justify-center overflow-hidden border border-red-400/30"
          style={{
            width: dimensions.box * 1.6,
            height: dimensions.box * 1.6,
          }}
        >
          {/* Subtle glossy sheen */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-2xl" />

          {/* Stagecoach emblem */}
          <svg
            viewBox="0 0 100 50"
            className="w-3/4 h-auto text-[#ffd54f] drop-shadow-xs"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Coach body */}
            <path d="M12 20 C12 14 16 10 24 10 L44 10 C52 10 56 14 56 20 L56 34 C56 38 52 42 44 42 L24 42 C16 42 12 38 12 34 Z" />
            <rect x="18" y="15" width="8" height="10" rx="2" fill="#b8151f" />
            <rect x="34" y="15" width="8" height="10" rx="2" fill="#b8151f" />
            {/* Driver & hat */}
            <path d="M44 6 C44 4 48 2 52 2 C56 2 58 4 58 6 L58 10 L44 10 Z" />
            <path d="M46 2 L56 2 L58 4 L44 4 Z" />
            {/* Wheels */}
            <circle cx="20" cy="42" r="7" stroke="#ffd54f" strokeWidth="2.5" fill="#b8151f" />
            <circle cx="48" cy="43" r="6" stroke="#ffd54f" strokeWidth="2" fill="#b8151f" />
            {/* Pole to horses */}
            <line x1="50" y1="42" x2="95" y2="38" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
            {/* Horses silhouette */}
            <path d="M60 36 C64 30 68 28 72 30 C74 31 76 28 78 24 L76 28 L74 36 Z" />
            <path d="M76 34 C80 28 84 26 88 28 C90 29 92 26 94 22 L92 26 L90 34 Z" />
          </svg>

          {/* Stacked WELLS FARGO */}
          <div className="text-center font-serif font-black leading-tight tracking-wider text-[#ffd54f] drop-shadow-xs">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em]">WELLS</div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em]">FARGO</div>
          </div>
        </div>
      </div>
    );
  }

  // If badge-only variant
  if (variant === 'badge-only') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-[#e0202a] to-[#b8151f] text-white font-serif font-black shadow-xs select-none ${className}`}
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <div className="text-center text-[#ffd54f] font-serif font-black leading-none">
          <div className="text-[9px] uppercase tracking-wider">WF</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Iconic Wells Fargo Red Square Emblem with Stagecoach or WF */}
      {showBox && (
        <div
          className="relative shrink-0 rounded-lg bg-gradient-to-b from-[#e0202a] to-[#b8151f] shadow-xs flex items-center justify-center p-1 border border-red-500/20"
          style={{
            width: dimensions.box,
            height: dimensions.box,
          }}
        >
          {showStagecoach ? (
            <svg
              viewBox="0 0 48 30"
              className="w-full h-full text-[#ffd54f]"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Detailed Concord Stagecoach Vector */}
              <path d="M6 10 C6 7 8 5 12 5 L24 5 C28 5 30 7 30 10 L30 18 C30 20 28 22 24 22 L12 22 C8 22 6 20 6 18 Z" />
              <rect x="9" y="8" width="5" height="6" rx="1" fill="#b8151f" />
              <rect x="19" y="8" width="5" height="6" rx="1" fill="#b8151f" />
              {/* Driver */}
              <path d="M24 2 C24 1 26 0 28 0 C30 0 31 1 31 2 L31 5 L24 5 Z" />
              {/* Wheels */}
              <circle cx="10" cy="22" r="4.5" stroke="#ffd54f" strokeWidth="1.5" fill="#b8151f" />
              <circle cx="26" cy="22.5" r="4" stroke="#ffd54f" strokeWidth="1.5" fill="#b8151f" />
              {/* Hitch & Horses */}
              <line x1="28" y1="22" x2="46" y2="20" stroke="#ffd54f" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M34 20 C36 17 38 16 40 17 L38 21 Z" />
              <path d="M41 19 C43 16 45 15 47 16 L45 20 Z" />
            </svg>
          ) : (
            <div className="font-serif font-black text-[#ffd54f] text-xs tracking-wider">
              WF
            </div>
          )}
        </div>
      )}

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-black uppercase tracking-widest ${dimensions.text} ${colorClasses}`}
          style={{ letterSpacing: '0.14em' }}
        >
          Wells Fargo
        </span>
        {subtitle && (
          <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-amber-300 -mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
