'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RADIO_STREAM } from '@/lib/data/multimedia';

const RadioContext = createContext(null);

export function RadioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: RADIO_STREAM.currentShow,
    subtitle: RADIO_STREAM.stationName,
    host: RADIO_STREAM.currentHost,
    url: RADIO_STREAM.streamUrl,
    fallbackUrl: RADIO_STREAM.fallbackAudio,
    isLiveStream: true,
  });
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      audioRef.current.onwaiting = () => setIsLoading(true);
      audioRef.current.onplaying = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsLoading(false);
        // If primary stream fails, fallback smoothly
        if (currentTrack.fallbackUrl && audioRef.current.src !== currentTrack.fallbackUrl) {
          audioRef.current.src = currentTrack.fallbackUrl;
          audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(false);
        }
      };

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      };
    }
  }, []);

  const togglePlay = (customTrack = null) => {
    if (!audioRef.current) return;

    if (customTrack) {
      setCurrentTrack(customTrack);
      setIsLoading(true);
      audioRef.current.src = customTrack.url || customTrack.fallbackUrl;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          if (customTrack.fallbackUrl) {
            audioRef.current.src = customTrack.fallbackUrl;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        })
        .finally(() => setIsLoading(false));
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentTrack.url || currentTrack.fallbackUrl;
      }
      setIsLoading(true);
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          if (currentTrack.fallbackUrl) {
            audioRef.current.src = currentTrack.fallbackUrl;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const playLiveRadio = () => {
    togglePlay({
      title: RADIO_STREAM.currentShow,
      subtitle: RADIO_STREAM.stationName,
      host: RADIO_STREAM.currentHost,
      url: RADIO_STREAM.streamUrl,
      fallbackUrl: RADIO_STREAM.fallbackAudio,
      isLiveStream: true,
    });
  };

  const handleVolumeChange = (newVol) => {
    const val = Math.max(0, Math.min(1, newVol));
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        isLoading,
        currentTrack,
        volume,
        isMuted,
        isPlayerVisible,
        setIsPlayerVisible,
        togglePlay,
        playLiveRadio,
        handleVolumeChange,
        toggleMute,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
}
