import React, { useEffect, useRef, useState } from 'react';

interface Props {
  src?: string; // local audio file
  youtubeId?: string; // optional YouTube video id to use as source
  autoplay?: boolean; // attempt to autoplay on load
}

declare global {
  interface Window { onYouTubeIframeAPIReady?: any; YT?: any; }
}

const BackgroundMusic: React.FC<Props> = ({ src = '/background-music.mp3', youtubeId }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const [startMuted, setStartMuted] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(() => {
    try { return localStorage.getItem('bgm_playing') === 'true'; } catch { return false; }
  });
  const [volume, setVolume] = useState<number>(() => {
    try { return Number(localStorage.getItem('bgm_volume') ?? '0.6'); } catch { return 0.6; }
  });
  const [available, setAvailable] = useState(true);

  // Helper to set volume to either audio element or youtube player
  const applyVolume = (v: number) => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try { playerRef.current.setVolume(Math.round(v * 100)); } catch {}
    }
    if (audioRef.current) audioRef.current.volume = v;
  };

  useEffect(() => {
    if (youtubeId) {
      // Load YouTube Iframe API if needed
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const handleAPIReady = () => {
        if (!playerContainerRef.current) return;
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          height: '0',
          width: '0',
          videoId: youtubeId,
          playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3 },
          events: {
            onReady: (e: any) => {
              applyVolume(volume);
              try {
                if (startMuted && typeof e.target.mute === 'function') e.target.mute();
              } catch {}
              if (playing) {
                try { e.target.playVideo(); } catch {}
              }
              // try to unmute after a short delay (may be blocked by browser)
              if (startMuted) {
                setTimeout(() => {
                  try { if (typeof e.target.unMute === 'function') e.target.unMute(); } catch {}
                  setStartMuted(false);
                }, 1500);
              }
            },
            onError: () => setAvailable(false),
          },
        });
      };

      if (window.YT && window.YT.Player) handleAPIReady();
      else {
        window.onYouTubeIframeAPIReady = handleAPIReady;
      }
      } else {
      // use audio element
      const a = new Audio(src);
      a.loop = true;
      a.volume = volume;
      a.preload = 'auto';
      audioRef.current = a;

      a.addEventListener('error', () => setAvailable(false));

      if (startMuted) a.muted = true;

      if (playing) {
        const p = a.play();
        if (p && typeof p.then === 'function') p.catch(() => {});
      }

      // try to unmute after a short delay to increase chance of audible autoplay
      if (startMuted && audioRef.current) {
        setTimeout(() => {
          try { if (audioRef.current) { audioRef.current.muted = false; audioRef.current.volume = volume; } } catch {}
          setStartMuted(false);
        }, 1500);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, youtubeId]);

  useEffect(() => { applyVolume(volume); try { localStorage.setItem('bgm_volume', String(volume)); } catch {} }, [volume]);

  useEffect(() => {
    try { localStorage.setItem('bgm_playing', playing ? 'true' : 'false'); } catch {}
    if (playerRef.current) {
      try { if (playing) playerRef.current.playVideo(); else playerRef.current.pauseVideo(); } catch {}
    }
    if (audioRef.current) {
      if (playing) {
        const p = audioRef.current.play();
        if (p && typeof p.then === 'function') p.catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  return (
    <div className="fixed left-4 bottom-24 z-[70] bg-white/80 backdrop-blur-sm rounded-xl shadow p-2 flex items-center gap-2 border border-gray-200">
      <button
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        onClick={() => setPlaying((p) => !p)}
        className="px-3 py-2 bg-yellow-400 rounded font-bold text-black"
      >
        {playing ? '⏸' : '▶'}
      </button>

      <div className="flex items-center gap-2">
        <input
          aria-label="Volumen de la música"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-36"
        />
      </div>

      {youtubeId ? (
        <div style={{ display: 'none' }} ref={playerContainerRef as any} />
      ) : (
        !available && <div className="text-sm text-red-600">Archivo no disponible. Coloca `public/background-music.mp3`.</div>
      )}
    </div>
  );
};

export default BackgroundMusic;
