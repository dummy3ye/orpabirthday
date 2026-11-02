import { Howl } from "howler";

const SOURCE = "/audio/happy-birthday.mp3";
let song: Howl | null = null;

export const FADE_SONG_ON_LEAVE = true;

export function preloadSong(onEnd: () => void, onError: () => void) {
  song?.unload();
  song = new Howl({
    src: [SOURCE],
    preload: true,
    html5: false,
    volume: 0,
    onend: onEnd,
    onloaderror: () => {
      console.warn(`Birthday song could not be loaded from ${SOURCE}.`);
      onError();
    },
    onplayerror: () => {
      console.warn(`Birthday song could not be played from ${SOURCE}.`);
      onError();
    },
  });
  return song;
}

export function playSong() {
  if (!song) return false;
  song.play();
  song.fade(0, 1, 300);
  return true;
}

export function stopSong() {
  if (!song) return;
  if (FADE_SONG_ON_LEAVE && song.playing()) {
    song.fade(song.volume(), 0, 1500);
    window.setTimeout(() => song?.stop(), 1500);
  } else {
    song.stop();
  }
  song.unload();
  song = null;
}
