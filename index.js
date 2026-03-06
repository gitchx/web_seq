let ctx;
let osc;
let gain;

let inputs = [];
let step = 0;
let intervalId;

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

document.addEventListener("DOMContentLoaded", () => {
  inputs = [...document.querySelectorAll("input")];

  document.getElementById("startBtn").addEventListener("click", startSound);
});

function startSound() {
  if (ctx) return;

  ctx = new AudioContext();

  osc = ctx.createOscillator();
  gain = ctx.createGain();

  osc.type = "sawtooth";
  gain.gain.value = 0;

  osc.connect(gain);
  gain.connect(ctx.destination);

  ctx.resume().then(() => {
    osc.start();

    intervalId = setInterval(sequence, 250);
  });
}

function sequence() {
  if (!ctx || !osc) return;

  inputs.forEach((el) => el.classList.remove("active"));

  inputs[step].classList.add("active");

  let midi = Number(inputs[step].value);
  let freq = midiToFreq(midi);

  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.cancelScheduledValues(ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

  document.getElementById("stepDisplay").textContent = step;

  step++;

  if (step >= inputs.length) step = 0;
}
