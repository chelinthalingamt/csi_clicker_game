// Clicker Game using Kaboom.js
import kaboom from "https://unpkg.com/kaboom@3000/dist/kaboom.mjs";

kaboom({
  background: [10, 10, 50],
});

// Load assets
loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");
loadSprite("star", "https://i.imgur.com/olM72b8.png");
loadSound("click", "https://freesound.org/data/previews/123/123442_512123-lq.mp3");

// Game state
let clicks = 0;
let multiplier = 1;
let rebirths = 0;
let soundOn = true;
let language = "en";
let currentSprite = "coin";

// Language Support
const translations = {
  en: {
    clicks: "Clicks",
    rebirths: "Rebirths",
    bonus: "Bonus Unlocked! x2 Multiplier",
    rebirthMsg: "Rebirth! Multiplier is now x",
    settings: "Settings: Sound",
    language: "Language",
    spriteSelect: "Select Clicker Object"
  },
  es: {
    clicks: "Clics",
    rebirths: "Renacimientos",
    bonus: "¡Bono Desbloqueado! Multiplicador x2",
    rebirthMsg: "¡Renacimiento! El multiplicador ahora es x",
    settings: "Configuración: Sonido",
    language: "Idioma",
    spriteSelect: "Selecciona el objeto de clic"
  }
};

// UI elements
const counter = add([
  text(`${translations[language].clicks}: 0`, { size: 32 }),
  pos(20, 20),
  z(2)
]);

const rebirthCounter = add([
  text(`${translations[language].rebirths}: 0`, { size: 24 }),
  pos(20, 60),
  z(2)
]);

// Clickable sprite
let clicker = add([
  sprite(currentSprite),
  pos(center()),
  scale(2),
  area(),
  "clickable",
  z(2)
]);

// Format numbers for large scales
function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num;
}

// Click event
function updateClicker() {
  clicker.onClick(() => {
    clicks += 1 * multiplier;
    if (soundOn) play("click");
    clicker.scale = vec2(2.2);
    wait(0.1, () => clicker.scale = vec2(2));
    counter.text = `${translations[language].clicks}: ${formatNumber(clicks)}`;
  });
}
updateClicker();

// Unlock system (additional upgrades at 100 and 200 clicks)
loop(1, () => {
  if (clicks >= 50 && multiplier === 1) {
    multiplier = 2;
    add([text(translations[language].bonus, { size: 24 }), pos(20, 100), z(2)]);
  }
  if (clicks >= 100 && multiplier === 2) {
    multiplier = 5;
    add([text("Bonus Unlocked! x5 Multiplier", { size: 24 }), pos(20, 130), z(2)]);
  }
  if (clicks >= 200 && multiplier === 5) {
    multiplier = 10;
    add([text("Bonus Unlocked! x10 Multiplier", { size: 24 }), pos(20, 160), z(2)]);
  }
});

// Rebirth system (New Game+ when reaching 500 clicks)
loop(1, () => {
  if (clicks >= 500) {
    clicks = 0;
    rebirths++;
    multiplier *= 2;
    counter.text = `${translations[language].clicks}: 0`;
    rebirthCounter.text = `${translations[language].rebirths}: ${rebirths}`;
    add([text(`${translations[language].rebirthMsg} ${multiplier}`, { size: 24 }), pos(20, 190), z(2)]);
  }
});

// Settings Panel
const settingsPanel = add([
  rect(250, 160),
  pos(20, 200),
  color(100, 100, 150),
  area(),
  opacity(0.8),
  z(1)
]);

const settingsText = add([
  text(`${translations[language].settings}: On`, { size: 16 }),
  pos(30, 220),
  area(),
  z(2)
]);

const languageText = add([
  text(`${translations[language].language}: EN`, { size: 16 }),
  pos(30, 250),
  area(),
  z(2)
]);

const spriteSelectText = add([
  text(`${translations[language].spriteSelect}`, { size: 16 }),
  pos(30, 280),
  area(),
  z(2)
]);

const spriteCycle = ["coin", "str"];
let spriteIndex = 0;

spriteSelectText.onClick(() => {
  spriteIndex = (spriteIndex + 1) % spriteCycle.length;
  currentSprite = spriteCycle[spriteIndex];
  destroy(clicker);
  clicker = add([
    sprite(currentSprite),
    pos(center()),
    scale(2),
    area(),
    "clickable",
    z(2)
  ]);
  updateClicker();
});

settingsText.onClick(() => {
  soundOn = !soundOn;
  settingsText.text = `${translations[language].settings}: ${soundOn ? "On" : "Off"}`;
});

languageText.onClick(() => {
  language = language === "en" ? "es" : "en";
  counter.text = `${translations[language].clicks}: ${formatNumber(clicks)}`;
  rebirthCounter.text = `${translations[language].rebirths}: ${rebirths}`;
  settingsText.text = `${translations[language].settings}: ${soundOn ? "On" : "Off"}`;
  languageText.text = `${translations[language].language}: ${language.toUpperCase()}`;
  spriteSelectText.text = `${translations[language].spriteSelect}`;
});
