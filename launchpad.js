const launchpadStatus = document.querySelector("#launchpad-status");
const launchpadPads = document.querySelectorAll(".launchpad-pad");

const launchpadConfig = {
  "1": { label: "Kick", type: "kick", color: "is-kick" },
  "2": { label: "Bass", type: "bass", note: 55, color: "is-bass" },
  "3": { label: "Lead", type: "lead", note: 261.63, color: "is-lead" },
  "4": { label: "FX", type: "fx", note: 780, color: "is-fx" },
  q: { label: "Kick 2", type: "kick", color: "is-kick", pitch: 0.9 },
  w: { label: "Bass 2", type: "bass", note: 73.42, color: "is-bass" },
  e: { label: "Chord", type: "chord", notes: [261.63, 329.63, 392], color: "is-lead" },
  r: { label: "Rise", type: "rise", note: 320, color: "is-fx" },
  a: { label: "Snare", type: "snare", color: "is-kick" },
  s: { label: "Sub", type: "bass", note: 41.2, color: "is-bass" },
  d: { label: "Pluck", type: "pluck", note: 523.25, color: "is-lead" },
  f: { label: "Sweep", type: "rise", note: 500, color: "is-fx" },
  z: { label: "Hat", type: "hat", color: "is-kick" },
  x: { label: "Tom", type: "tom", note: 110, color: "is-bass" },
  c: { label: "Bell", type: "bell", note: 659.25, color: "is-lead" },
  v: { label: "Crash", type: "crash", color: "is-fx" },
};

const launchpadCodeMap = {
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  KeyQ: "q",
  KeyW: "w",
  KeyE: "e",
  KeyR: "r",
  KeyA: "a",
  KeyS: "s",
  KeyD: "d",
  KeyF: "f",
  KeyZ: "z",
  KeyX: "x",
  KeyC: "c",
  KeyV: "v",
};

let audioContext;

function setLaunchpadStatus(message) {
  if (launchpadStatus instanceof HTMLElement) {
    launchpadStatus.textContent = message;
  }
}

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function applyEnvelope(gainNode, startTime, attack, decay, sustainValue, releaseTime) {
  gainNode.gain.cancelScheduledValues(startTime);
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(1, startTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(sustainValue, 0.0001), startTime + decay);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + releaseTime);
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 0.5, context.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < output.length; i += 1) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playKick(context, pitch = 1) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(160 * pitch, now);
  oscillator.frequency.exponentialRampToValueAtTime(42 * pitch, now + 0.24);
  applyEnvelope(gainNode, now, 0.002, 0.02, 0.45, now + 0.28 - now);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

function playTone(context, frequency, waveform, duration, volume) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = waveform;
  oscillator.frequency.setValueAtTime(frequency, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.max(900, frequency * 3), now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playNoiseHit(context, filterType, frequency, duration, volume) {
  const now = context.currentTime;
  const source = context.createBufferSource();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  source.buffer = createNoiseBuffer(context);
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  source.start(now);
  source.stop(now + duration);
}

function playChord(context, notes) {
  notes.forEach((note, index) => {
    window.setTimeout(() => {
      playTone(context, note, "triangle", 0.55, 0.18);
    }, index * 8);
  });
}

function playRise(context, startFrequency) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(startFrequency * 3.2, now + 0.5);
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(startFrequency * 1.4, now);
  filter.frequency.exponentialRampToValueAtTime(startFrequency * 4.5, now + 0.5);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.14, now + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.56);
}

function triggerPad(key) {
  const config = launchpadConfig[key];
  if (!config) {
    return;
  }

  const context = ensureAudioContext();

  switch (config.type) {
    case "kick":
      playKick(context, config.pitch || 1);
      break;
    case "bass":
      playTone(context, config.note, "square", 0.42, 0.22);
      break;
    case "lead":
      playTone(context, config.note, "sawtooth", 0.38, 0.16);
      break;
    case "pluck":
      playTone(context, config.note, "triangle", 0.24, 0.18);
      break;
    case "bell":
      playTone(context, config.note, "sine", 0.75, 0.14);
      break;
    case "tom":
      playTone(context, config.note, "sine", 0.28, 0.2);
      break;
    case "snare":
      playNoiseHit(context, "highpass", 1800, 0.16, 0.26);
      break;
    case "hat":
      playNoiseHit(context, "highpass", 5200, 0.07, 0.18);
      break;
    case "crash":
      playNoiseHit(context, "bandpass", 2800, 0.5, 0.18);
      break;
    case "chord":
      playChord(context, config.notes);
      break;
    case "rise":
      playRise(context, config.note);
      break;
    case "fx":
      playRise(context, config.note);
      break;
    default:
      playTone(context, 440, "sine", 0.3, 0.15);
  }

  const pad = document.querySelector(`.launchpad-pad[data-key="${key}"]`);
  if (pad instanceof HTMLElement) {
    pad.classList.remove("is-active");
    void pad.offsetWidth;
    pad.classList.add("is-active");
    window.setTimeout(() => pad.classList.remove("is-active"), 160);
  }

  setLaunchpadStatus(`${config.label} · ${key.toUpperCase()} 재생 중`);
}

launchpadPads.forEach((pad) => {
  pad.addEventListener("pointerdown", () => {
    if (!(pad instanceof HTMLElement)) {
      return;
    }
    triggerPad(String(pad.dataset.key || "").toLowerCase());
  });
});

window.addEventListener("keydown", (event) => {
  if (event.repeat) {
    return;
  }

  const key = launchpadCodeMap[event.code] || event.key.toLowerCase();
  if (!launchpadConfig[key]) {
    return;
  }

  event.preventDefault();
  triggerPad(key);
});
