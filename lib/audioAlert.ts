/**
 * Audio Notification Manager menggunakan Web Audio API Synthesizer
 * Bekerja 100% offline tanpa ketergantungan file audio eksternal yang rentan 404
 */
class SoundEngine {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public isAudioUnlocked(): boolean {
    return !!this.audioCtx && this.audioCtx.state === "running";
  }

  public async unlockAudio(): Promise<boolean> {
    const ctx = this.getAudioContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx.state === "running";
  }

  /**
   * Mainkan nada lonceng/chime Islami lembut saat masuk waktu sholat
   */
  public playGentleChime(volume: number = 0.8) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Harmonic chime chords (E major: E4, G#4, B4, E5)
    const notes = [329.63, 415.3, 493.88, 659.25];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.25);

      // Smooth attack & long tranquil decay
      gain.gain.setValueAtTime(0.001, now + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.3 * volume, now + idx * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.25 + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 2.1);
    });
  }

  /**
   * Nada Peringatan 10 Menit Sebelum Adzan (Persiapan ke Masjid / Wudhu)
   * Chime 3 nada lembut nan tenang (C5 - E5 - G5)
   */
  public playPreAdzanChime(volume: number = 0.8) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.22 }, // E5
      { freq: 783.99, time: 0.44 }, // G5
    ];

    const now = ctx.currentTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, now + n.time);

      gain.gain.setValueAtTime(0.001, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.32 * volume, now + n.time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + 1.25);
    });
  }

  /**
   * Mainkan takbir nada singkat
   */
  public playTakbirBeep(volume: number = 0.8) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const sequence = [
      { freq: 440, duration: 0.4, delay: 0 },
      { freq: 554.37, duration: 0.4, delay: 0.45 },
      { freq: 659.25, duration: 0.8, delay: 0.9 },
    ];

    const now = ctx.currentTime;
    sequence.forEach((s) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(s.freq, now + s.delay);

      gain.gain.setValueAtTime(0.001, now + s.delay);
      gain.gain.exponentialRampToValueAtTime(0.35 * volume, now + s.delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + s.delay + s.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + s.delay);
      osc.stop(now + s.delay + s.duration + 0.05);
    });
  }

  /**
   * Memicu Web Notification jika diizinkan oleh user
   */
  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    }
    return false;
  }

  public sendNotification(title: string, body: string) {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
        });
      } catch (e) {
        console.error("Failed to show notification", e);
      }
    }
  }
}

export const soundEngine = new SoundEngine();
