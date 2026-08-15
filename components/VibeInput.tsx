'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Wand2,
  Paperclip,
  Zap,
  Check
} from 'lucide-react';
import { VIBE_PRESETS } from '@/lib/templates';
import { VibeStyle } from '@/lib/types';
import { playVibeTone } from '@/lib/audio';

interface VibeInputProps {
  onSendMessage: (text: string, attachedImages?: string[], vibeStyle?: VibeStyle) => void;
  isLoading: boolean;
  soundEnabled: boolean;
}

export function VibeInput({ onSendMessage, isLoading, soundEnabled }: VibeInputProps) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [vibeStyle, setVibeStyle] = useState<VibeStyle>('builder');
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Voice recognition setup
  const toggleVoice = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: simulate voice dictation with a quick vibe prompt
      setInputText((prev) => prev ? `${prev} Make the UI look like a high-end cyberpunk mobile app` : 'Make the UI look like a high-end cyberpunk mobile app');
      if (soundEnabled) playVibeTone('tap');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      if (soundEnabled) playVibeTone('tap');
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          if (soundEnabled) playVibeTone('code');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputText((prev) => {
            const base = prev.trim();
            return base ? `${base} ${currentTranscript}` : currentTranscript;
          });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech error', event);
          setIsRecording(false);
          if (soundEnabled) playVibeTone('error');
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition', err);
        setIsRecording(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedImages((prev) => [...prev, event.target!.result as string]);
          if (soundEnabled) playVibeTone('tap');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSend = () => {
    if ((!inputText.trim() && attachedImages.length === 0) || isLoading) return;

    if (soundEnabled) playVibeTone('send');
    onSendMessage(inputText.trim(), attachedImages, vibeStyle);
    setInputText('');
    setAttachedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const styleLabels: Record<VibeStyle, { label: string; desc: string; icon: any; color: string }> = {
    builder: { label: 'Full Builder', desc: 'Creates complete features and modules', icon: Wand2, color: 'text-zinc-200' },
    creative: { label: 'Ultra Vibe', desc: 'Bold creative UI redesigns & effects', icon: Sparkles, color: 'text-zinc-300' },
    surgical: { label: 'Surgical Fix', desc: 'Pinpoint bugfixes and optimizations', icon: Zap, color: 'text-zinc-200' },
    minimal: { label: 'Minimal Clean', desc: 'Refined spacing, typography and tokens', icon: Check, color: 'text-zinc-100' },
  };

  return (
    <div className="bg-black/95 border-t border-zinc-800 p-2.5 pb-20 space-y-2 backdrop-blur-2xl">
      {/* Vibe Prompt Quick Chips Carousel */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none">
        {VIBE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setInputText(preset.prompt);
              if (soundEnabled) playVibeTone('tap');
              if (textareaRef.current) {
                textareaRef.current.focus();
              }
            }}
            className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Attached Images Preview */}
      {attachedImages.length > 0 && (
        <div className="flex gap-2 p-1 overflow-x-auto">
          {attachedImages.map((img, idx) => (
            <div key={idx} className="relative w-14 h-14 rounded-xl border border-zinc-700 overflow-hidden shrink-0 group">
              <img src={img} alt="Attachment" className="w-full h-full object-cover" />
              <button
                onClick={() => setAttachedImages(attachedImages.filter((_, i) => i !== idx))}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/90 text-white rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="flex items-end gap-1.5 bg-zinc-900/90 border border-zinc-700 rounded-2xl p-1.5 shadow-inner focus-within:border-zinc-500 transition-all">
        {/* Style Selector & Attach */}
        <div className="flex items-center gap-0.5 pb-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-8 h-8 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors"
            title="Attach Wireframe or Screenshot"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Voice Dictation Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-white text-black animate-pulse shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title={isRecording ? 'Listening...' : 'Voice Dictate Vibe'}
          >
            {isRecording ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Listening to your voice prompt...' : 'Prompt Antigravity 2.0...'}
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm px-2 py-1.5 focus:outline-none resize-none max-h-32 leading-relaxed"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!inputText.trim() && attachedImages.length === 0) || isLoading}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 ${
            (inputText.trim() || attachedImages.length > 0) && !isLoading
              ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-md font-bold'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
