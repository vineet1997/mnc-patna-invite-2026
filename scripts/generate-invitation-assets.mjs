import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";

const root = process.cwd();
const invitationUrl = "https://home-fashionista-rising-2026.vercel.app/";
const backgroundPath = path.join(root, "assets", "patna-fabric-background.png");
const ogPath = path.join(root, "public", "og.jpg");
const printDirectory = path.join(root, "output", "print");
const printPath = path.join(printDirectory, "home-fashionista-rising-2026-patna-card.png");
const printPreviewPath = path.join(printDirectory, "home-fashionista-rising-2026-patna-card-preview.jpg");

const fontPath = (...parts) => path.join(root, "node_modules", ...parts);
const fonts = {
  cormorant: await fs.readFile(fontPath("@fontsource", "cormorant-garamond", "files", "cormorant-garamond-latin-600-normal.woff2")),
  cormorantMedium: await fs.readFile(fontPath("@fontsource", "cormorant-garamond", "files", "cormorant-garamond-latin-500-normal.woff2")),
  cormorantItalic: await fs.readFile(fontPath("@fontsource", "cormorant-garamond", "files", "cormorant-garamond-latin-500-italic.woff2")),
  manrope: await fs.readFile(fontPath("@fontsource-variable", "manrope", "files", "manrope-latin-wght-normal.woff2")),
};

const fontFaces = `
  @font-face { font-family: 'Cormorant'; src: url(data:font/woff2;base64,${fonts.cormorant.toString("base64")}) format('woff2'); font-weight: 600; }
  @font-face { font-family: 'Cormorant'; src: url(data:font/woff2;base64,${fonts.cormorantMedium.toString("base64")}) format('woff2'); font-weight: 500; }
  @font-face { font-family: 'Cormorant'; src: url(data:font/woff2;base64,${fonts.cormorantItalic.toString("base64")}) format('woff2'); font-weight: 500; font-style: italic; }
  @font-face { font-family: 'Manrope'; src: url(data:font/woff2;base64,${fonts.manrope.toString("base64")}) format('woff2'); font-weight: 200 800; }
`;

function qrMarkup(url, x, y, totalSize) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const quiet = 4;
  const moduleSize = totalSize / (size + quiet * 2);
  const codeX = x + quiet * moduleSize;
  const codeY = y + quiet * moduleSize;
  const modules = [];

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (!qr.modules.data[row * size + column]) continue;
      modules.push(`<rect x="${(codeX + column * moduleSize).toFixed(2)}" y="${(codeY + row * moduleSize).toFixed(2)}" width="${(moduleSize + 0.08).toFixed(2)}" height="${(moduleSize + 0.08).toFixed(2)}"/>`);
    }
  }

  return `<g fill="#160B11"><rect x="${x}" y="${y}" width="${totalSize}" height="${totalSize}" rx="8" fill="#F8F2E8"/>${modules.join("")}</g>`;
}

const ogTypography = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <style>${fontFaces}</style>
  <defs>
    <linearGradient id="reading-field" x1="0" x2="1"><stop offset="0" stop-color="#090609" stop-opacity=".99"/><stop offset=".54" stop-color="#090609" stop-opacity=".92"/><stop offset=".68" stop-color="#090609" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="760" height="630" fill="url(#reading-field)"/>
  <text x="72" y="57" fill="#B9ADA6" font-family="Manrope, Arial" font-size="11" font-weight="700" letter-spacing="3.2">HOSTED BY</text>
  <text x="70" y="105" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="48" font-weight="600" letter-spacing=".5">Mukesh <tspan fill="#CDAA76" font-style="italic" font-weight="500">&amp;</tspan> Company</text>
  <line x1="72" y1="137" x2="130" y2="137" stroke="#CDAA76" stroke-width="2"/>
  <text x="69" y="270" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="78" font-weight="500" letter-spacing="-1.2">Home Fashionista</text>
  <text x="60" y="398" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="136" font-style="italic" font-weight="500" letter-spacing="-5">Rising</text>
  <text x="448" y="365" fill="#CDAA76" font-family="Cormorant, Georgia" font-size="36" font-weight="600" letter-spacing="3">2026</text>
  <text x="72" y="465" fill="#D8CEC5" font-family="Manrope, Arial" font-size="14" font-weight="430" letter-spacing=".5">An exclusive preview of the new season.</text>
  <line x1="72" y1="516" x2="542" y2="516" stroke="#F5EEE4" stroke-opacity=".22"/>
  <text x="72" y="555" fill="#CDAA76" font-family="Manrope, Arial" font-size="12" font-weight="700" letter-spacing="3">TUESDAY · 08 SEPTEMBER</text>
  <text x="72" y="582" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="24" font-weight="600">11:00 AM onwards · Patna</text>
</svg>`;

async function renderOg() {
  let quality = 80;
  let output;
  do {
    output = await sharp(backgroundPath).resize(1200, 630, { fit: "cover", position: "centre" }).composite([{ input: Buffer.from(ogTypography) }]).jpeg({ quality, progressive: true, chromaSubsampling: "4:2:0", mozjpeg: true }).toBuffer();
    quality -= 3;
  } while (output.length > 285 * 1024 && quality >= 62);
  await fs.writeFile(ogPath, output);
  return output.length;
}

const qr = qrMarkup(invitationUrl, 1450, 850, 230);
const printArtwork = `
<svg width="1819" height="1240" viewBox="0 0 1819 1240" xmlns="http://www.w3.org/2000/svg">
  <style>${fontFaces}</style>
  <defs><linearGradient id="print-field" x1="0" x2="1"><stop offset="0" stop-color="#090609" stop-opacity="1"/><stop offset=".58" stop-color="#090609" stop-opacity=".93"/><stop offset=".76" stop-color="#090609" stop-opacity=".08"/></linearGradient></defs>
  <rect width="1320" height="1240" fill="url(#print-field)"/>
  <g fill="none" stroke="#CDAA76" stroke-opacity=".6" stroke-width="1"><path d="M35 12v18M12 35h18M1784 12v18M1789 35h18M35 1210v18M12 1205h18M1784 1210v18M1789 1205h18"/></g>
  <text x="128" y="112" fill="#B9ADA6" font-family="Manrope, Arial" font-size="15" font-weight="700" letter-spacing="4">HOSTED BY</text>
  <text x="124" y="180" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="68" font-weight="600">Mukesh <tspan fill="#CDAA76" font-style="italic" font-weight="500">&amp;</tspan> Company</text>
  <line x1="128" y1="224" x2="208" y2="224" stroke="#CDAA76" stroke-width="3"/>
  <text x="122" y="445" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="116" font-weight="500" letter-spacing="-2">Home Fashionista</text>
  <text x="108" y="625" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="194" font-style="italic" font-weight="500" letter-spacing="-7">Rising</text>
  <text x="680" y="574" fill="#CDAA76" font-family="Cormorant, Georgia" font-size="56" font-weight="600" letter-spacing="3">2026</text>
  <text x="128" y="704" fill="#D8CEC5" font-family="Manrope, Arial" font-size="20" font-weight="430">An exclusive preview of the new season.</text>
  <path d="M128 770 C420 782, 720 745, 1045 766" fill="none" stroke="#CDAA76" stroke-opacity=".8" stroke-width="2"/>
  <text x="128" y="902" fill="#CDAA76" font-family="Manrope, Arial" font-size="15" font-weight="750" letter-spacing="4">TUESDAY</text>
  <text x="124" y="986" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="82" font-weight="500">08</text>
  <text x="236" y="952" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="40" font-weight="600">September</text>
  <text x="239" y="987" fill="#B9ADA6" font-family="Manrope, Arial" font-size="15" font-weight="650" letter-spacing="2">11:00 AM ONWARDS</text>
  <line x1="510" y1="895" x2="510" y2="1008" stroke="#F5EEE4" stroke-opacity=".22"/>
  <text x="563" y="902" fill="#CDAA76" font-family="Manrope, Arial" font-size="15" font-weight="750" letter-spacing="4">PATNA</text>
  <text x="560" y="954" fill="#F5EEE4" font-family="Cormorant, Georgia" font-size="36" font-weight="600">Crystal Hall (9 to 9)</text>
  <text x="563" y="990" fill="#B9ADA6" font-family="Manrope, Arial" font-size="14" font-weight="650" letter-spacing="1.4">NUTAN TOWER · BANDAR BAGICHA</text>
  ${qr}
</svg>`;

async function renderPrintCard() {
  await fs.mkdir(printDirectory, { recursive: true });
  const artwork = await sharp(backgroundPath).resize(1819, 1240, { fit: "cover", position: "centre" }).composite([{ input: Buffer.from(printArtwork) }]).png({ compressionLevel: 9, quality: 92 }).withMetadata({ density: 300 }).toBuffer();
  await fs.writeFile(printPath, artwork);
  await sharp(artwork).resize(1200, 818).jpeg({ quality: 82, progressive: true, chromaSubsampling: "4:2:0", mozjpeg: true }).toFile(printPreviewPath);
}

const ogBytes = await renderOg();
await renderPrintCard();
console.log(`Created public/og.jpg (${Math.round(ogBytes / 1024)} KB)`);
console.log(`Created ${path.relative(root, printPath)}`);
console.log(`Created ${path.relative(root, printPreviewPath)}`);
