import React, { useState } from 'react';
import { User, CheckCircle2, Camera } from 'lucide-react';

interface UserProfileAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded' | 'circle';
  showVerifiedBadge?: boolean;
  isLocked?: boolean;
  onEditClick?: () => void;
  className?: string;
}

export const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'rounded',
  showVerifiedBadge = true,
  isLocked = false,
  onEditClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-18 h-18 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const badgeSizeClasses = {
    sm: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    md: 'w-4 h-4 sm:w-5 sm:h-5 -bottom-1 -right-1',
    lg: 'w-5 h-5 sm:w-6 sm:h-6 -bottom-1 -right-1',
    xl: 'w-6 h-6 -bottom-1.5 -right-1.5',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  }[size];

  // Professional continuous border radius: rounded-2xl with ring styling
  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const hasValidImage = Boolean(src && !imageError);

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        onClick={onEditClick}
        className={`relative ${sizeClasses} ${radiusClass} overflow-hidden bg-gradient-to-br from-stone-850 to-stone-950 ring-2 ring-[#ffcc00] ring-offset-2 ring-offset-stone-900 shadow-md shadow-black/40 transition-all duration-200 group ${
          onEditClick ? 'cursor-pointer hover:ring-[#ffd700] hover:scale-[1.03] active:scale-[0.98]' : ''
        }`}
        title={
          isLocked
            ? 'Official Customer Photo ID Locked • Changes restricted to Bank Administrator'
            : onEditClick
            ? 'Click to position or adjust profile photo'
            : `${name} - Verified Profile`
        }
      >
        {hasValidImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center ${radiusClass}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-amber-300">
            <User className={`${iconSizes} text-amber-400`} />
            {size !== 'sm' && (
              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-200/90 mt-0.5">
                ID Photo
              </span>
            )}
          </div>
        )}

        {/* Hover Overlay */}
        {onEditClick && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
            {isLocked ? (
              <>
                <svg
                  className="w-4 h-4 text-[#ffcc00] mb-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {size !== 'sm' && (
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-300 leading-tight">
                    Locked
                  </span>
                )}
                <span className="text-[7px] text-stone-200 hidden sm:inline">Admin Only</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 text-amber-300" />
                {size !== 'sm' && (
                  <span className="text-[8px] font-semibold text-white/90 mt-0.5">Adjust</span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Verified Status Dot Badge */}
      {showVerifiedBadge && (
        <div
          className={`absolute ${badgeSizeClasses} rounded-full bg-emerald-500 border-2 border-stone-900 flex items-center justify-center shadow-md shadow-black/50 z-10 pointer-events-none`}
          title="Verified Identity"
        >
          <CheckCircle2 className="w-full h-full text-white p-0.5" />
        </div>
      )}

      {/* Persistent Mini Lock Badge when photo is locked */}
      {isLocked && hasValidImage && (
        <div
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-stone-950 border border-amber-400 text-amber-300 flex items-center justify-center shadow-md z-20 pointer-events-none"
          title="Official Record Locked (Admin Only)"
        >
          <svg className="w-2.5 h-2.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}
    </div>
  );
};
