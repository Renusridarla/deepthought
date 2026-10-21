import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, X, Move, AlertCircle } from "lucide-react";

export function WebcamPIP({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // offset from bottom-right

  useEffect(() => {
    let currentStream = null;

    if (isOpen) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 320, height: 240 }, audio: false })
        .then((s) => {
          currentStream = s;
          setStream(s);
          setError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Webcam access error:", err);
          setError("Camera permission denied or camera not found. Please allow camera access in your browser.");
        });
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Re-attach stream if video element re-renders
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-50 bg-slate-900 border-2 border-blue-500 rounded-2xl shadow-2xl overflow-hidden w-64 md:w-72 animate-fadeIn"
      style={{
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.3)"
      }}
    >
      {/* Top Bar of Floating Camera */}
      <div className="bg-slate-950/90 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Camera Feed (For Video Recording)
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Turn off camera"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Video Stream Preview */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="p-4 text-center text-xs text-rose-300 flex flex-col items-center gap-1.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="leading-snug">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100" // mirrored for natural feel
          />
        )}

        {/* Overlay Badge */}
        {!error && (
          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
            Visible on screen
          </div>
        )}
      </div>

      {/* Bottom helper text */}
      <div className="bg-slate-950/90 px-3 py-1 text-[10px] text-slate-400 font-sans text-center">
        Use Windows Snipping Tool (Win+Shift+R) or Loom to record this screen
      </div>
    </div>
  );
}
