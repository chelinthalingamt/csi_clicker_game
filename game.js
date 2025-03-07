// Clicker Game using Kaboom.js
import kaboom from "https://unpkg.com/kaboom@3000/dist/kaboom.mjs";

kaboom({
  background: [10, 10, 50],
});

// Load assets
loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");
loadSound("click", "https://freesound.org/data/previews/123/123442_512123-lq.mp3");

// Game state
let clicks = 0;
let multiplier = 1;
let rebirths = 0;

// UI elements
const counter = add([
  text(`Clicks: ${clicks}`, { size: 32 }),
  pos(20, 20),
  { update() { this.text = `Clicks: ${clicks}`; } }
]);

const rebirthCounter = add([
  text(`Rebirths: ${rebirths}`, { size: 24 }),
  pos(20, 60),
  { update() { this.text = `Rebirths: ${rebirths}`; } }
]);

// Clickable sprite
const coin = add([
  sprite("coin"),
  pos(center()),
  scale(2),
  area(),
  "clickable"
]);

// Click event
coin.onClick(() => {
  clicks += 1 * multiplier;
  play("click");
  coin.scale = vec2(2.2);
  wait(0.1, () => coin.scale = vec2(2));
});

// Unlock system (passive bonus at 50 clicks)
loop(1, () => {
  if (clicks >= 50 && multiplier === 1) {
    multiplier = 2;
    add([text("Bonus Unlocked! x2 Multiplier", { size: 24 }), pos(20, 100)]);
  }
});

// Rebirth system (New Game+ when reaching 500 clicks)
loop(1, () => {
  if (clicks >= 500) {
    clicks = 0;
    rebirths++;
    multiplier *= 2;
    add([text(`Rebirth! Multiplier is now x${multiplier}`, { size: 24 }), pos(20, 140)]);
  }
});

// Settings Panel
const settingsPanel = add([
  rect(200, 100),
  pos(20, 200),
  color(100, 100, 150),
  area(),
  "settings"
]);

const settingsText = add([
  text("Settings: Tap to Toggle Sound", { size: 16 }),
  pos(30, 220)
]);

let soundOn = true;
settingsPanel.onClick(() => {
  soundOn = !soundOn;
  play("click", { volume: soundOn ? 1 : 0 });
  settingsText.text = `Sound: ${soundOn ? "On" : "Off"}`;
});
