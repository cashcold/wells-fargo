import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, X, Eye, FileText, ShieldCheck, Sparkles, RefreshCw, Move } from 'lucide-react';
import { compressImageFile } from '../../utils/imageUtils';
import { ImageCropPositionModal } from './ImageCropPositionModal';

interface IdUploadWidgetProps {
  frontImage?: string;
  backImage?: string;
  onFrontChange: (dataUrl: string) => void;
  onBackChange?: (dataUrl: string) => void;
  idTypeLabel?: string;
}

// High-fidelity sample state ID mockup for quick demo testing
export const SAMPLE_ID_FRONT =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 315" width="500" height="315">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdfbf7"/>
      <stop offset="50%" stop-color="#eef2f6"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="500" height="315" rx="16" fill="url(#bg)" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Header Bar -->
  <path d="M 0,16 Q 0,0 16,0 L 484,0 Q 500,0 500,16 L 500,55 L 0,55 Z" fill="url(#headerGrad)"/>
  <text x="25" y="36" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="3">CALIFORNIA</text>
  <text x="350" y="35" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="13" font-weight="700" fill="#fde047">USA REAL ID</text>
  <circle cx="468" cy="28" r="14" fill="#fbbf24"/>
  <path d="M 468,18 L 471,25 L 478,25 L 472,30 L 474,37 L 468,32 L 462,37 L 464,30 L 458,25 L 465,25 Z" fill="#b45309"/>

  <!-- Subheader -->
  <rect x="0" y="55" width="500" height="18" fill="#dbeafe"/>
  <text x="25" y="68" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e40af">DRIVER LICENSE / IDENTIFICATION CARD</text>
  <text x="380" y="68" font-family="monospace" font-size="11" font-weight="bold" fill="#dc2626">CLASS C</text>

  <!-- Photo Box -->
  <rect x="25" y="90" width="130" height="165" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- User Silhouette in ID -->
  <circle cx="90" cy="145" r="32" fill="#64748b"/>
  <path d="M 42,235 C 45,185 135,185 138,235 Z" fill="#64748b"/>
  <rect x="25" y="260" width="130" height="20" rx="4" fill="#0f172a"/>
  <text x="40" y="274" font-family="monospace" font-size="10" font-weight="bold" fill="#f8fafc">VERIFIED CITIZEN</text>

  <!-- ID Data Fields -->
  <text x="175" y="105" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc2626">DL: D8920147</text>
  <text x="330" y="105" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc2626">EXP: 06/14/2029</text>

  <text x="175" y="128" font-family="Arial, sans-serif" font-size="9" color="#64748b" fill="#64748b">FN</text>
  <text x="175" y="142" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">CARDHOLDER / APPLICANT</text>

  <text x="175" y="162" font-family="Arial, sans-serif" font-size="9" fill="#64748b">ADDRESS</text>
  <text x="175" y="176" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#1e293b">1048 MONTGOMERY ST, APT 4B</text>
  <text x="175" y="190" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#1e293b">SAN FRANCISCO, CA 94133</text>

  <text x="175" y="212" font-family="Arial, sans-serif" font-size="9" fill="#64748b">DOB</text>
  <text x="175" y="226" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">06/14/1992</text>

  <text x="270" y="212" font-family="Arial, sans-serif" font-size="9" fill="#64748b">SEX</text>
  <text x="270" y="226" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">M</text>

  <text x="330" y="212" font-family="Arial, sans-serif" font-size="9" fill="#64748b">HAIR</text>
  <text x="330" y="226" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">BRN</text>

  <text x="390" y="212" font-family="Arial, sans-serif" font-size="9" fill="#64748b">EYES</text>
  <text x="390" y="226" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">BLU</text>

  <text x="175" y="248" font-family="Arial, sans-serif" font-size="9" fill="#64748b">ISS: 04/10/2021</text>
  <text x="280" y="248" font-family="Arial, sans-serif" font-size="9" fill="#64748b">HGT: 5'-11"</text>
  <text x="370" y="248" font-family="Arial, sans-serif" font-size="9" fill="#64748b">WGT: 175 lb</text>

  <!-- Security Hologram Seal -->
  <circle cx="435" cy="150" r="28" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="415" y="153" font-family="serif" font-size="10" font-weight="bold" fill="#0284c7">VERIFIED</text>

  <!-- Bottom Barcode Strip -->
  <rect x="175" y="266" width="300" height="20" fill="#f1f5f9" stroke="#cbd5e1"/>
  <text x="185" y="280" font-family="monospace" font-size="10" fill="#475569">||| | ||||| || |||||| | |||| ||| ||||||| | |||| |</text>
</svg>
`);

export const IdUploadWidget: React.FC<IdUploadWidgetProps> = ({
  frontImage,
  backImage,
  onFrontChange,
  onBackChange,
  idTypeLabel = "Driver's License or Government Photo ID",
}) => {
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [rawImageToCrop, setRawImageToCrop] = useState<string | null>(null);
  const [cropTargetIsFront, setCropTargetIsFront] = useState(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isFront: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropTargetIsFront(isFront);
    try {
      const dataUrl = await compressImageFile(file);
      setRawImageToCrop(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setRawImageToCrop(dataUrl);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be re-selected if desired
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCropTargetIsFront(true);
      try {
        const dataUrl = await compressImageFile(file);
        setRawImageToCrop(dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setRawImageToCrop(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file & camera inputs */}
      <input
        ref={frontFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, true)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e, true)}
      />
      <input
        ref={backFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, false)}
      />

      {/* Main Front of ID Upload Box */}
      <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d71e28]" />
            <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
              Government Photo ID Verification <span className="text-red-600">*</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onFrontChange(SAMPLE_ID_FRONT)}
              className="text-[11px] font-semibold text-[#d71e28] hover:text-[#9b131c] hover:underline inline-flex items-center gap-1 cursor-pointer"
              title="Fill with official California Real ID specimen for demo testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Use Sample Real ID</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-600">
          Upload a clear photo or scan of your {idTypeLabel} (Driver's License, State ID, or US Passport).
        </p>

        {frontImage ? (
          /* Uploaded Preview Card */
          <div className="bg-white border-2 border-emerald-500/60 rounded-xl p-3 shadow-xs space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-800">ID Image Attached & Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActivePreviewUrl(frontImage);
                    setIsPreviewOpen(true);
                  }}
                  className="text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 text-[11px] font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFrontChange('')}
                  className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 text-[11px] font-medium ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Display */}
            <div
              onClick={() => {
                setActivePreviewUrl(frontImage);
                setIsPreviewOpen(true);
              }}
              className="relative h-44 w-full bg-stone-100 rounded-lg overflow-hidden border border-stone-200 cursor-pointer flex items-center justify-center group"
            >
              <img
                src={frontImage}
                alt="Uploaded Government ID"
                className="w-full h-full object-contain p-1 group-hover:scale-[1.02] transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Click to view high-resolution ID</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 text-[11px] text-stone-500 pt-1">
              <span>Format: JPEG / PNG / WebP</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCropTargetIsFront(true);
                    setRawImageToCrop(frontImage);
                  }}
                  className="text-amber-700 hover:text-amber-900 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
                  title="Position face or adjust framing"
                >
                  <Move className="w-3 h-3 text-amber-600" />
                  <span>Adjust Face & Framing</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="text-stone-700 hover:text-stone-900 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-[#d71e28]" />
                  <span>Retake</span>
                </button>
                <button
                  type="button"
                  onClick={() => frontFileInputRef.current?.click()}
                  className="text-[#d71e28] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Choose Another</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop / File Input Box */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragActive
                ? 'border-[#d71e28] bg-red-50/50'
                : 'border-stone-300 hover:border-[#d71e28] bg-white hover:bg-stone-50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#d71e28] flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <div className="font-semibold text-xs text-stone-900">
              Upload your photo ID or drag & drop image file
            </div>
            <div className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto">
              Clear front photo of Driver's License, State ID, National ID, or Passport (JPG, PNG, WebP)
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => frontFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 bg-[#d71e28] hover:bg-[#b81620] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xs cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload ID Photo File</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xs cursor-pointer transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Take Photo with Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Back of ID (Optional) */}
        {onBackChange && (
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">Back of ID (Optional):</span>
            {backImage ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Back Attached
                </span>
                <button
                  type="button"
                  onClick={() => onBackChange('')}
                  className="text-stone-400 hover:text-red-600 text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => backFileInputRef.current?.click()}
                className="text-[#d71e28] font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Back of ID</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Enlarged View Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-[#d71e28] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Government Photo ID Document
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-full hover:bg-black/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-stone-900 flex items-center justify-center min-h-[300px]">
              <img
                src={activePreviewUrl}
                alt="Enlarged ID Preview"
                className="max-h-[70vh] max-w-full object-contain rounded shadow-lg"
              />
            </div>
            <div className="p-3 bg-stone-100 border-t border-stone-200 text-right">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-1.5 bg-stone-800 text-white text-xs font-semibold rounded-full hover:bg-stone-900"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-Precision Face & ID Crop / Positioning Modal */}
      {rawImageToCrop && (
        <ImageCropPositionModal
          isOpen={Boolean(rawImageToCrop)}
          imageSrc={rawImageToCrop}
          cropShape="circle"
          title="Align Face & Position Photo"
          onCropComplete={(croppedDataUrl) => {
            if (cropTargetIsFront) {
              onFrontChange(croppedDataUrl);
            } else if (onBackChange) {
              onBackChange(croppedDataUrl);
            }
            setRawImageToCrop(null);
          }}
          onCancel={() => setRawImageToCrop(null)}
        />
      )}
    </div>
  );
};
