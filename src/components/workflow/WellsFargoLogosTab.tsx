import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Smartphone,
  Globe,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { WfLogo } from '../common/WfLogo';

export const WellsFargoLogosTab: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light' | 'red'>('dark');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const svgWebLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="wfRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e0202a"/>
      <stop offset="100%" stop-color="#b8151f"/>
    </linearGradient>
    <linearGradient id="wfGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff176"/>
      <stop offset="50%" stop-color="#ffd54f"/>
      <stop offset="100%" stop-color="#ffb300"/>
    </linearGradient>
  </defs>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#wfRedGrad)"/>
  <!-- Wells Fargo Stagecoach Emblem -->
  <g transform="translate(48, 80) scale(1.15)" fill="url(#wfGoldGrad)">
    <path d="M 68 88 C 68 76, 76 68, 88 68 L 136 68 C 148 68, 156 76, 156 88 L 156 120 C 156 132, 148 140, 136 140 L 88 140 C 76 140, 68 132, 68 120 Z" />
    <rect x="80" y="80" width="24" height="28" rx="4" fill="#b8151f" />
    <rect x="116" y="80" width="24" height="28" rx="4" fill="#b8151f" />
    <circle cx="84" cy="144" r="26" stroke="url(#wfGoldGrad)" stroke-width="6" fill="none" />
    <circle cx="146" cy="148" r="20" stroke="url(#wfGoldGrad)" stroke-width="5" fill="none" />
    <line x1="156" y1="144" x2="340" y2="136" stroke="url(#wfGoldGrad)" stroke-width="5" stroke-linecap="round" />
  </g>
  <text x="256" y="345" fill="url(#wfGoldGrad)" font-family="serif" font-size="88" font-weight="900" letter-spacing="12" text-anchor="middle">WELLS</text>
  <text x="256" y="440" fill="url(#wfGoldGrad)" font-family="serif" font-size="88" font-weight="900" letter-spacing="12" text-anchor="middle">FARGO</text>
</svg>`;

  const xmlAndroidVector = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <group
        android:scaleX="0.65"
        android:scaleY="0.65"
        android:translateX="18.9"
        android:translateY="18.9">
        <!-- Wells Fargo Stagecoach and Gold Brandmark -->
        <path
            android:fillColor="#ffcc00"
            android:pathData="M24,40 C24,34 28,30 36,30 L56,30 C64,30 68,34 68,40 L68,54 C68,58 64,62 56,62 L36,62 C28,62 24,58 24,54 Z" />
        <path
            android:fillColor="#ba161f"
            android:pathData="M30,35h8v10h-8z M46,35h8v10h-8z" />
        <path
            android:fillColor="#ffcc00"
            android:pathData="M32,62 A6,6 0 1,0 32,74 A6,6 0 1,0 32,62" />
        <path
            android:fillColor="#ffcc00"
            android:pathData="M60,63 A5,5 0 1,0 60,73 A5,5 0 1,0 60,63" />
        <path
            android:strokeColor="#ffcc00"
            android:strokeWidth="2"
            android:pathData="M62,62 L94,58" />
    </group>
</vector>`;

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-[#c9d1d9]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] rounded-xl p-4">
        <div>
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffd54f]" />
            <span>Official Wells Fargo Brand Assets (Web & Android Phone)</span>
          </h3>
          <p className="text-xs text-[#8b949e] mt-1">
            Authentic Wells Fargo Red Box emblems, gold Stagecoach vectors, Web Favicons, and Android adaptive launcher icons.
          </p>
        </div>

        {/* Theme Preview Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] text-xs">
          <span className="text-[10px] text-[#8b949e] px-1.5 uppercase font-semibold">Preview BG:</span>
          <button
            onClick={() => setPreviewTheme('dark')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              previewTheme === 'dark' ? 'bg-[#21262d] text-white font-medium' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setPreviewTheme('light')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              previewTheme === 'light' ? 'bg-[#21262d] text-white font-medium' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setPreviewTheme('red')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              previewTheme === 'red' ? 'bg-[#21262d] text-white font-medium' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            WF Red
          </button>
        </div>
      </div>

      {/* Grid: Web Logo Asset & Android Phone Logo Asset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Web Assets */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#58a6ff]" />
                <h4 className="font-bold text-white text-sm">Web Portal & Browser Assets</h4>
              </div>
              <span className="bg-[#21262d] text-[#58a6ff] border border-[#30363d] text-[10px] px-2 py-0.5 rounded-full font-mono">
                /public/favicon.svg
              </span>
            </div>

            {/* Logo Preview Area */}
            <div
              className={`rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-colors border border-[#30363d] min-h-[180px] ${
                previewTheme === 'dark'
                  ? 'bg-[#090d13]'
                  : previewTheme === 'light'
                  ? 'bg-stone-100'
                  : 'bg-[#d71e28]'
              }`}
            >
              {/* Full Brandmark */}
              <div className="p-3 bg-black/20 rounded-xl backdrop-blur-xs flex items-center gap-3">
                <WfLogo size="lg" variant={previewTheme === 'red' ? 'white' : previewTheme === 'light' ? 'red' : 'white'} />
              </div>

              {/* Favicon / Badge */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#e0202a] to-[#b8151f] shadow-md flex items-center justify-center border border-red-400/40">
                    <span className="font-serif font-black text-amber-300 text-sm tracking-wider">WF</span>
                  </div>
                  <span className="text-[10px] text-[#8b949e]">Favicon 48px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#e0202a] to-[#b8151f] shadow-xs flex items-center justify-center border border-red-400/40">
                    <span className="font-serif font-black text-amber-300 text-[10px] tracking-wider">WF</span>
                  </div>
                  <span className="text-[10px] text-[#8b949e]">Tab 16/32px</span>
                </div>
              </div>
            </div>

            {/* Features Description */}
            <ul className="text-xs space-y-1.5 text-[#8b949e]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Web Favicon: Vector SVG linked in <code className="text-[#58a6ff]">index.html</code></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Web App Manifest: <code className="text-[#58a6ff]">/public/manifest.json</code> configured</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Theme color: <code className="text-white">#d71e28</code> applied to browser chrome</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#30363d]">
            <button
              onClick={() => copyToClipboard(svgWebLogo, 'web-svg')}
              className="bg-[#21262d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border border-[#30363d] transition-colors cursor-pointer"
            >
              {copiedType === 'web-svg' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span>Copied SVG!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8b949e]" />
                  <span>Copy SVG</span>
                </>
              )}
            </button>
            <button
              onClick={() => downloadFile(svgWebLogo, 'wells-fargo-web-logo.svg', 'image/svg+xml')}
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>

        {/* Card 2: Android Phone Assets */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#3fb950]" />
                <h4 className="font-bold text-white text-sm">Android Phone App & Launcher Assets</h4>
              </div>
              <span className="bg-[#21262d] text-[#3fb950] border border-[#30363d] text-[10px] px-2 py-0.5 rounded-full font-mono">
                @mipmap/ic_launcher
              </span>
            </div>

            {/* Android Icon Preview Area */}
            <div
              className={`rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-colors border border-[#30363d] min-h-[180px] ${
                previewTheme === 'dark'
                  ? 'bg-[#090d13]'
                  : previewTheme === 'light'
                  ? 'bg-stone-100'
                  : 'bg-[#d71e28]'
              }`}
            >
              {/* Android Home Screen App Icon Preview */}
              <div className="flex items-center gap-6">
                {/* Standard Adaptive Launcher Icon */}
                <div className="flex flex-col items-center gap-1.5">
                  <WfLogo variant="app-icon" size="md" />
                  <span className="text-[11px] font-medium text-white drop-shadow-xs">Wells Fargo</span>
                </div>

                {/* Round Icon for Pixel / Samsung Launcher */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#e0202a] to-[#b8151f] shadow-lg flex flex-col items-center justify-center overflow-hidden border border-red-400/40 p-2">
                    <span className="text-amber-300 font-serif font-black text-xs">WF</span>
                    <span className="text-[8px] text-amber-200 uppercase font-sans font-bold tracking-widest">Mobile</span>
                  </div>
                  <span className="text-[10px] text-[#8b949e]">Round Icon</span>
                </div>
              </div>
            </div>

            {/* Android Resource Hierarchy */}
            <ul className="text-xs space-y-1.5 text-[#8b949e]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Adaptive Launcher: <code className="text-[#3fb950]">res/mipmap-anydpi-v26/ic_launcher.xml</code></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Foreground Vector: <code className="text-[#3fb950]">res/drawable/ic_launcher_foreground.xml</code></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Background Solid: <code className="text-[#3fb950]">res/drawable/ic_launcher_background.xml</code> (#d71e28)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Splash Screen: <code className="text-[#3fb950]">res/drawable/splash.xml</code> with AppTheme.NoActionBarLaunch</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#30363d]">
            <button
              onClick={() => copyToClipboard(xmlAndroidVector, 'android-xml')}
              className="bg-[#21262d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border border-[#30363d] transition-colors cursor-pointer"
            >
              {copiedType === 'android-xml' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span>Copied Android XML!</span>
                </>
              ) : (
                <>
                  <Code2 className="w-3.5 h-3.5 text-[#8b949e]" />
                  <span>Copy Android Vector XML</span>
                </>
              )}
            </button>
            <button
              onClick={() => downloadFile(xmlAndroidVector, 'ic_launcher_foreground.xml', 'application/xml')}
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Vector XML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Snippets & Android XML Implementation */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#58a6ff]" />
          <span>Android Manifest Integration Snippet (Fixed in AndroidManifest.xml)</span>
        </h4>
        <div className="bg-[#090d13] border border-[#30363d] rounded-lg p-3 font-mono text-[11px] text-[#c9d1d9] overflow-x-auto">
          <pre>{`<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="Wells Fargo Mobile"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme">`}</pre>
        </div>
      </div>
    </div>
  );
};
