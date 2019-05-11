const Jimp = require('jimp');

const rect = (img, xMin, yMin, xMax, yMax, padSize, color) => 
  drawRect(img, xMin, yMin, xMax, yMax, padSize, color, false);

const rectFill = (img, xMin, yMin, xMax, yMax, padSize, color) => 
  drawRect(img, xMin, yMin, xMax, yMax, padSize, color, true);

const drawRect = (img, xMin, yMin, xMax, yMax, padSize, color, isFilled) => {
  for (x of range(xMin, xMax)) {
    for (y of range(yMin, yMax)) { 
      if (withinRange(y, yMin, padSize) || withinRange(x, xMin, padSize) || 
          withinRange(y, yMax, padSize) || withinRange(x, xMax, padSize)) {
        img.setPixelColor(Jimp.cssColorToHex(color), x, y);
      } else if (isFilled && (y <= (yMax + padSize) && x <= (xMax + padSize))) {
        img.setPixelColor(Jimp.cssColorToHex(color), x, y);
      }
    }
  }
}

const drawLine = (img, xMin, yMin, xMax, yMax, padSize, color) => {
  const xLength = Math.abs(xMax - xMin);
  const yLength = Math.abs(yMax - yMin);
  const steps = xLength > yLength ? xLength : yLength;
  const xStep = (xMax - xMin) / steps;
  const yStep = (yMax - yMin) / steps;
  let x = xMin;
  let y = yMin;
  for (s of range(0, steps)) {
    x = x + xStep;
    y = y + yStep;
    for (i of range(x - padSize, x + padSize)) {
      img.setPixelColor(Jimp.cssColorToHex(color), i, y);
    }
    for (j of range(y - padSize, y + padSize)) {
      img.setPixelColor(Jimp.cssColorToHex(color), x, j);
    }  
  }
}

const getScaledFont = (width, color) => {
  if (width > 1600)
    return color === 'black' ? Jimp.FONT_SANS_128_BLACK : Jimp.FONT_SANS_128_WHITE;
  else if (width > 700)
    return color === 'black' ? Jimp.FONT_SANS_32_BLACK : Jimp.FONT_SANS_32_WHITE;
  else
  return color === 'black' ? Jimp.FONT_SANS_16_BLACK : Jimp.FONT_SANS_16_WHITE;
}

const getPadSize = width => {
  if (width > 1600)
    return 7;
  else if (width > 1000)
    return 4;
  else if (width > 700)
    return 3;
  else
    return 2;
}

const withinRange = (i, line, range) =>
  (line-range<=i)&&(i<=line+range);

function* range(start, end) {
  for (let i = start; i <= end; i++) {
      yield i;
  }
}

module.exports = {
  rect, 
  rectFill,
  getScaledFont,
  getPadSize,
  drawLine
};