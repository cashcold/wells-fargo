import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Copy,
  Volume2,
  BookmarkPlus,
  Bot,
  Settings,
  Check,
  X,
  Trash2,
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { VoiceNote } from '../../types/banking';

interface VoiceTypingWidgetProps {
  onSendToAssistant?: (text: string) => void;
  onSaveNote?: (note: VoiceNote) => void;
  savedNotes?: VoiceNote[];
  className?: string;
  defaultExpanded?: boolean;
}

export const VoiceTypingWidget: React.FC<VoiceTypingWidgetProps> = ({
  onSendToAssistant,
  onSaveNote,
  savedNotes = [],
  className = '',
  defaultExpanded = true,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [notesList, setNotesList] = useState<VoiceNote[]>(savedNotes);

  // Settings
  const [lang, setLang] = useState<'en-US' | 'es-US'>('en-US');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [continuous, setContinuous] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcuts Alt+A and Alt+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handlePlaySelection();
      } else if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveToLibrary();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transcript, notesList]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          currentTranscript += item[0].transcript;
        }
        setTranscript((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${currentTranscript.trim()}` : currentTranscript.trim();
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [lang, continuous]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback if browser doesn't support Web Speech API
      if (!isListening) {
        setIsListening(true);
        const sampleTexts = [
          'Allocate $25,000 into the 13-week Treasury Bill auction at 5.18% discount.',
          'Review WellsTrade Roth IRA annual contribution limits for 2026.',
          'Enable Auto-Roll reinvestment for upcoming Treasury bill settlement on Tuesday.',
          'Compare WellsTrade standard individual brokerage account against Way2Save.',
        ];
        const random = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setTimeout(() => {
          setTranscript((prev) => (prev ? `${prev}\n${random}` : random));
          setIsListening(false);
        }, 1200);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleCopy = async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePlaySelection = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    let textToSpeak = transcript;
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (start !== end) {
        textToSpeak = transcript.substring(start, end);
      }
    }

    if (!textToSpeak.trim()) {
      textToSpeak = 'No text selected for voice playback.';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.lang = lang;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveToLibrary = () => {
    if (!transcript.trim()) return;

    const newNote: VoiceNote = {
      id: `vn-${Date.now()}`,
      title: transcript.slice(0, 32) + (transcript.length > 32 ? '...' : ''),
      text: transcript,
      createdAt: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      tags: ['Voice Note', 'Financial Planning'],
    };

    setNotesList((prev) => [newNote, ...prev]);
    if (onSaveNote) onSaveNote(newNote);
    setShowLibrary(true);
  };

  const handleTalkToAssistant = () => {
    if (onSendToAssistant && transcript.trim()) {
      onSendToAssistant(transcript);
    }
  };

  return (
    <div
      className={`bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden transition-all ${className}`}
    >
      {/* Header bar matching the user's brief */}
      <div className="bg-[#f9f8f6] border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#d71e28]/10 text-[#d71e28] flex items-center justify-center font-bold">
            <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse text-[#d71e28]' : ''}`} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-stone-900 tracking-tight flex items-center gap-2">
              Voice Typing
              {isListening && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-sans text-[#d71e28] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#d71e28] animate-ping" />
                  Listening...
                </span>
              )}
            </h3>
            <p className="text-[11px] text-stone-500">
              Dictate trade notes, Treasury bill instructions, or queries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-200/60 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-200/60 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs text-stone-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Speech Recognition Language:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('en-US')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  lang === 'en-US' ? 'bg-[#d71e28] text-white' : 'bg-white border text-stone-700'
                }`}
              >
                English (US)
              </button>
              <button
                onClick={() => setLang('es-US')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  lang === 'es-US' ? 'bg-[#d71e28] text-white' : 'bg-white border text-stone-700'
                }`}
              >
                Español
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Audio Playback Speed:</span>
            <div className="flex gap-2">
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeechRate(rate)}
                  className={`px-2 py-0.5 rounded text-xs ${
                    speechRate === rate
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-white border text-stone-700'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Main textarea with live status */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Ready for your note — just start speaking..."
              rows={4}
              className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d71e28] focus:border-transparent bg-stone-50/50 resize-y leading-relaxed text-stone-800 placeholder:text-stone-400 placeholder:italic"
            />
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700 p-1"
                title="Clear note"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Row matching the user's prompt:
              Copy | Play selection (Alt+A) | Save to Library (Alt+S) | Talk to Assistant / Dictate | Settings */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                disabled={!transcript}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Copy note to clipboard"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Play selection (Alt+A) */}
              <button
                onClick={handlePlaySelection}
                disabled={!transcript}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isPlayingAudio
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-700 bg-stone-100 hover:bg-stone-200'
                }`}
                title="Play selection or note aloud (Shortcut: Alt+A)"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>Play selection</span>
                <span className="hidden sm:inline-block text-[10px] bg-stone-200 text-stone-600 px-1 py-0.2 rounded font-mono">
                  Alt+A
                </span>
              </button>

              {/* Save to Library (Alt+S) */}
              <button
                onClick={handleSaveToLibrary}
                disabled={!transcript}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Save note to library (Shortcut: Alt+S)"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save to Library</span>
                <span className="hidden sm:inline-block text-[10px] bg-stone-200 text-stone-600 px-1 py-0.2 rounded font-mono">
                  Alt+S
                </span>
              </button>

              {/* Library Drawer Toggle */}
              {notesList.length > 0 && (
                <button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="text-xs text-stone-500 hover:text-stone-900 underline px-2 py-1"
                >
                  Saved ({notesList.length})
                </button>
              )}
            </div>

            {/* Right Controls: Dictate / Mic & Talk to Assistant */}
            <div className="flex items-center gap-2">
              {/* Talk to Assistant */}
              {onSendToAssistant && (
                <button
                  onClick={handleTalkToAssistant}
                  disabled={!transcript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors disabled:opacity-40"
                  title="Send transcribed note to Fargo Virtual Assistant"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-700" />
                  <span>Talk to Assistant</span>
                </button>
              )}

              {/* Main Dictate / Mic toggle */}
              <button
                onClick={toggleListening}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                  isListening
                    ? 'bg-[#d71e28] text-white hover:bg-[#b81620] animate-pulse ring-2 ring-red-300'
                    : 'bg-[#d71e28] text-white hover:bg-[#b81620]'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Stop Dictating' : 'Dictate'}</span>
              </button>
            </div>
          </div>

          {/* Saved Library Drawer */}
          {showLibrary && notesList.length > 0 && (
            <div className="mt-3 pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-xs text-stone-900">
                  Saved Financial & Order Notes
                </span>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {notesList.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1 hover:border-stone-300"
                  >
                    <div className="flex items-center justify-between text-stone-500 text-[10px]">
                      <span>{note.createdAt}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setTranscript(note.text)}
                          className="text-[#d71e28] hover:underline font-semibold"
                        >
                          Load
                        </button>
                        <button
                          onClick={() =>
                            setNotesList((prev) => prev.filter((n) => n.id !== note.id))
                          }
                          className="text-stone-400 hover:text-red-600 p-0.5"
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-stone-800 line-clamp-2">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
