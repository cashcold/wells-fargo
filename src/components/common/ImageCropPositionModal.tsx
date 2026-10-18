import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  Move,
  Sparkles,
  User,
  CreditCard,
} from 'lucide-react';

interface ImageCropPositionModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
  cropShape?: 'circle' | 'square' | 'id-card';
  title?: string;
}

export const ImageCropPositionModal: React.FC<ImageCropPositionModalProps> = ({
  isOpen,
  imageSrc,
  onCropComplete,
  onCancel,
  cropShape: initialShape = 'circle',
  title = 'Position & Adjust Photo',
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [shape, setShape] = useState<'circle' | 'square' | 'id-card'>(initialShape);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset when a new image is loaded
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);

    // Auto-fit zoom so the smallest dimension fills the crop box
    if (containerRef.current) {
      const boxSize = 280;
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      if (minDim > 0) {
        const initialZoom = Math.max(1, (boxSize / minDim) * 1.15);
        setZoom(initialZoom);
      }
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(4, Math.max(0.6, prev + delta)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset positioning
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // Perform Final Crop on Canvas
  const handleApplyCrop = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output dimensions (high-res 600x600 for sharp avatars, 600x380 for cards)
    const outputWidth = shape === 'id-card' ? 600 : 500;
    const outputHeight = shape === 'id-card' ? 380 : 500;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Viewport box dimensions in UI
    const viewportWidth = shape === 'id-card' ? 320 : 280;
    const viewportHeight = shape === 'id-card' ? 202 : 280;
    const scaleFactor = outputWidth / viewportWidth;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Save and transform context
    ctx.save();
    // Move origin to center of crop
    ctx.translate(outputWidth / 2, outputHeight / 2);
    // Apply pan scaled
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    // Apply zoom
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    // Draw the image centered
    const imgW = imgRef.current.naturalWidth;
    const imgH = imgRef.current.naturalHeight;
    // Scale image relative to display sizing
    const displayAspect = imgW / imgH;
    let drawW = viewportWidth;
    let drawH = viewportWidth / displayAspect;
    if (drawH < viewportHeight) {
      drawH = viewportHeight;
      drawW = viewportHeight * displayAspect;
    }

    ctx.drawImage(imgRef.current, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Export as clean JPEG data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  };

  if (!isOpen || !imageSrc) return null;

  const isIdCard = shape === 'id-card';
  const boxWidth = isIdCard ? 320 : 280;
  const boxHeight = isIdCard ? 202 : 280;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-[#d71e28] flex items-center justify-center text-stone-950 font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-stone-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-tight">{title}</h3>
              <p className="text-[11px] text-stone-400">
                Drag to align face, zoom, or rotate before saving
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framing Selector Bar */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-stone-800/60 bg-stone-950/40">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Framing Mask
          </span>
          <div className="flex items-center gap-1.5 bg-stone-800/80 p-1 rounded-xl border border-stone-700/60">
            <button
              type="button"
              onClick={() => setShape('circle')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                shape === 'circle'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Face / Avatar</span>
            </button>
            <button
              type="button"
              onClick={() => setShape('id-card')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                shape === 'id-card'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>ID Document</span>
            </button>
          </div>
        </div>

        {/* Interactive Viewport Area */}
        <div className="relative p-6 bg-stone-950 flex flex-col items-center justify-center select-none overflow-hidden min-h-[340px]">
          {/* Instructions Pill */}
          <div className="absolute top-2.5 bg-stone-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-stone-300 border border-stone-700/60 flex items-center gap-1.5 z-20 pointer-events-none shadow-xs">
            <Move className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Click & drag to position face inside guide</span>
          </div>

          {/* Mask Container */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{ width: boxWidth, height: boxHeight }}
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-amber-400/90 shadow-[0_0_0_9999px_rgba(10,10,10,0.85)] z-10 ${
              shape === 'circle' ? 'rounded-full' : isIdCard ? 'rounded-2xl' : 'rounded-3xl'
            }`}
          >
            {/* Center Face Oval Target Guide */}
            {shape === 'circle' && (
              <div className="absolute inset-4 rounded-full border border-dashed border-white/40 pointer-events-none z-10 flex flex-col items-center justify-center">
                <div className="w-24 h-32 rounded-full border border-amber-400/40 pointer-events-none" />
                <span className="text-[9px] text-white/60 font-semibold uppercase tracking-wider mt-1">
                  Align Face Here
                </span>
              </div>
            )}

            {/* Crosshairs */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white -translate-y-1/2" />
            </div>

            {/* Transforming Image */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              }}
              className="w-full h-full flex items-center justify-center pointer-events-none"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Source preview"
                onLoad={handleImageLoad}
                className="max-w-none pointer-events-none select-none"
                style={{
                  width: boxWidth,
                  height: 'auto',
                  objectFit: 'contain',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-5 border-t border-stone-800 bg-stone-900/90 space-y-4">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-400">
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                Zoom / Scale
              </span>
              <span className="font-mono text-[11px] text-amber-400">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.15))}
                className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.6"
                max="3.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-amber-400 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3.5, prev + 0.15))}
                className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary Actions (Rotate, Reset) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl text-xs font-semibold text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Rotate 90°</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl text-xs font-semibold text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset zoom & pan"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>Reset</span>
              </button>
            </div>

            <span className="text-[11px] text-stone-400 font-mono">
              {naturalSize.width} × {naturalSize.height}px
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-[#d71e28] hover:brightness-110 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
              <span>Apply & Set Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
