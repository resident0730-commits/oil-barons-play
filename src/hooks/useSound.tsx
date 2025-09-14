import { useCallback } from 'react';

// Простой хук для воспроизведения звуков
export const useSound = () => {
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  const sounds = {
    coin: () => playSound(800, 200, 'square'),
    success: () => {
      playSound(523.25, 200, 'sine'); // C5
      setTimeout(() => playSound(659.25, 200, 'sine'), 100); // E5
      setTimeout(() => playSound(783.99, 300, 'sine'), 200); // G5
    },
    purchase: () => {
      playSound(440, 150, 'triangle'); // A4
      setTimeout(() => playSound(554.37, 150, 'triangle'), 75); // C#5
      setTimeout(() => playSound(659.25, 200, 'triangle'), 150); // E5
    },
    caseOpen: () => {
      // Звук открытия кейса
      playSound(200, 100, 'sawtooth');
      setTimeout(() => playSound(300, 100, 'sawtooth'), 50);
      setTimeout(() => playSound(400, 100, 'sawtooth'), 100);
      setTimeout(() => playSound(500, 200, 'sine'), 150);
    },
    upgrade: () => {
      playSound(659.25, 100, 'sine'); // E5
      setTimeout(() => playSound(783.99, 100, 'sine'), 50); // G5
      setTimeout(() => playSound(987.77, 100, 'sine'), 100); // B5
      setTimeout(() => playSound(1318.51, 200, 'sine'), 150); // E6
    },
    error: () => {
      playSound(200, 300, 'sawtooth');
    },
    notify: () => {
      playSound(800, 100, 'sine');
      setTimeout(() => playSound(1000, 150, 'sine'), 100);
    }
  };

  return sounds;
};