import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'assets', 'thumbnails');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const simulations = [
  { slug: 'constant-velocity-sim', url: 'https://thinking-experiment-sims.github.io/constant-velocity-sim/' },
  { slug: 'graph-that-motion-sim', url: 'https://thinking-experiment-sims.github.io/graph-that-motion-sim/' },
  { slug: 'uniform-acceleration-ramp-lab', url: 'https://thinking-experiment-sims.github.io/uniform-acceleration-ramp-lab/' },
  { slug: 'downhill-motion-sim', url: 'https://thinking-experiment-sims.github.io/downhill-motion-sim/' },
  { slug: 'rocket-sled-simulation', url: 'https://thinking-experiment-sims.github.io/rocket-sled-simulation/' },
  { slug: 'balanced-forces-sim', url: 'https://thinking-experiment-sims.github.io/balanced-forces-sim/' },
  { slug: 'statics-3d-sim', url: 'https://thinking-experiment-sims.github.io/statics-3d-sim/' },
  { slug: 'atwood-machine-simulation', url: 'https://thinking-experiment-sims.github.io/atwood-machine-simulation/' },
  { slug: 'half-atwood-sim', url: 'https://thinking-experiment-sims.github.io/half-atwood-sim/' },
  { slug: 'half-atwood-inquiry-sim', url: 'https://thinking-experiment-sims.github.io/half-atwood-inquiry-sim/' },
  { slug: 'types-of-collisions-inquiry-sim', url: 'https://vladimirlopez.github.io/types-of-collisions-inquiry-sim/' },
  { slug: 'hookes-law-simulation', url: 'https://thinking-experiment-sims.github.io/hookes-law-simulation/' },
  { slug: 'work-energy-concepts-sim', url: 'https://thinking-experiment-sims.github.io/work-energy-concepts-sim/' },
  { slug: 'conservation-of-energy-sim', url: 'https://thinking-experiment-sims.github.io/conservation-of-energy-sim/' },
  { slug: 'understanding-energy-sim', url: 'https://thinking-experiment-sims.github.io/understanding-energy-sim/' },
  { slug: 'newtons-third-law-stations-sim', url: 'https://thinking-experiment-sims.github.io/newtons-third-law-stations-sim/' },
  { slug: 'elevator-ride-sim', url: 'https://thinking-experiment-sims.github.io/elevator-ride-sim/' },
  { slug: 'ripple-lab-studio', url: 'https://thinking-experiment-sims.github.io/ripple-lab-studio/' },
  { slug: 'speed-of-sound-lab-sim', url: 'https://thinking-experiment-sims.github.io/speed-of-sound-lab-sim/' },
  { slug: 'charging-demo', url: 'https://vladimirlopez.github.io/chargingDemo/' },
  { slug: 'coulombs-law-inquiry-sim', url: 'https://thinking-experiment-sims.github.io/coulombs-law-inquiry-sim/' },
  { slug: 'electric-fields-sim', url: 'https://thinking-experiment-sims.github.io/electric-fields-sim/' },
  { slug: 'rainbow-prism-refraction-lab', url: 'https://thinking-experiment-sims.github.io/rainbow-prism-refraction-lab/' },
  { slug: 'image-location-mirrors-lenses-sim', url: 'https://vladimirlopez.github.io/image-location-mirrors-lenses-sim/index.html' },
  { slug: 'stellar-evolution-simulation', url: 'https://thinking-experiment-sims.github.io/stellar-evolution-simulation/' },
  { slug: 'tangent-line-analysis', url: 'https://vladimirlopez.github.io/slope_tangents/' },
];

console.log(`Starting capture for ${simulations.length} simulations...`);

const chromeBinary = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

for (let i = 0; i < simulations.length; i++) {
  const { slug, url } = simulations[i];
  const targetFile = path.join(outDir, `${slug}.png`);
  console.log(`[${i + 1}/${simulations.length}] Capturing: ${slug} (${url})...`);

  try {
    const cmd = `"${chromeBinary}" --headless=new --screenshot="${targetFile}" --window-size=1280,720 --virtual-time-budget=3500 "${url}"`;
    execSync(cmd, { stdio: 'ignore', timeout: 25000 });

    if (fs.existsSync(targetFile)) {
      // Resize to 640 width with sips
      execSync(`sips -Z 640 "${targetFile}"`, { stdio: 'ignore' });
      const stats = fs.statSync(targetFile);
      console.log(`  ✓ Success: ${(stats.size / 1024).toFixed(1)} KB`);
    } else {
      console.warn(`  ✗ File not generated for ${slug}, copying placeholder`);
      fs.copyFileSync(path.join(outDir, 'placeholder.svg'), targetFile.replace('.png', '.svg'));
    }
  } catch (err) {
    console.warn(`  ✗ Failed for ${slug}: ${err.message}`);
    const svgTarget = path.join(outDir, `${slug}.svg`);
    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(path.join(outDir, 'placeholder.svg'), svgTarget);
    }
  }
}

console.log('Capture process finished!');
