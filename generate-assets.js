const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, pixelGenerator) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const offset = y * (1 + width * 4);
    rawData[offset] = 0;
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 4;
      const [r, g, b, a] = pixelGenerator(x, y, width, height);
      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
      rawData[px + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);

  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function iconPixel(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.42;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > r + 2) return [0, 0, 0, 0];
  if (dist > r) {
    const alpha = Math.max(0, Math.round(255 * (1 - (dist - r) / 2)));
    return [98, 0, 238, alpha];
  }

  const s = w / 1024;
  const sw = 72 * s;
  const padX = 260 * s;
  const padY = 220 * s;
  const left = cx - padX;
  const right = cx + padX;
  const top = cy - padY;
  const bottom = cy + padY;
  const midY = cy + 40 * s;
  const notchBottom = cy + 60 * s;

  const inStroke = (
    isInRect(x, y, left, top, sw, bottom - top) ||
    isInRect(x, y, right - sw, top, sw, bottom - top) ||
    isInTriangle(x, y, left + sw, top, left + padX, notchBottom, sw) ||
    isInTriangle(x, y, right - sw, top, right - padX, notchBottom, sw) ||
    isInRect(x, y, cx - sw / 2, notchBottom, sw, bottom - notchBottom)
  );

  if (inStroke) return [255, 255, 255, 255];

  return [98, 0, 238, 255];
}

function isInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

function isInTriangle(px, py, x1, y1, x2, y2, halfW) {
  const ddx = x2 - x1;
  const ddy = y2 - y1;
  const len = Math.sqrt(ddx * ddx + ddy * ddy);
  if (len === 0) return false;
  const nx = -ddy / len;
  const ny = ddx / len;
  const apx = px - x1;
  const apy = py - y1;
  const proj = apx * ddx / len + apy * ddy / len;
  const perp = Math.abs(apx * nx + apy * ny);
  return proj >= 0 && proj <= len && perp <= halfW;
}

function isInLine(px, py, x1, y1, x2, y2, halfWidth) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return false;

  const nx = -dy / len;
  const ny = dx / len;

  const apx = px - x1;
  const apy = py - y1;

  const proj = apx * dx / len + apy * dy / len;
  const perp = Math.abs(apx * nx + apy * ny);

  if (proj < -halfWidth || proj > len + halfWidth) return false;
  if (perp > halfWidth) return false;

  return true;
}

function splashPixel(x, y, w, h) {
  return [98, 0, 238, 255];
}

const assetsDir = path.join(__dirname, 'assets');

fs.writeFileSync(path.join(assetsDir, 'icon.png'), createPNG(1024, 1024, iconPixel));
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), createPNG(1024, 1024, iconPixel));
fs.writeFileSync(path.join(assetsDir, 'splash.png'), createPNG(1242, 2436, splashPixel));

console.log('App icons generated successfully!');
