const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = path.resolve(__dirname, '..')
const svgPath = path.join(root, 'assets', 'app-icons', 'brain-app-icon.svg')
if (!fs.existsSync(svgPath)) {
  console.error('SVG not found:', svgPath)
  process.exit(1)
}
const svgBuffer = fs.readFileSync(svgPath)

const android = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
}

async function genAndroid() {
  for (const dir of Object.keys(android)) {
    const size = android[dir]
    const outDir = path.join(root, 'android', 'app', 'src', 'main', 'res', dir)
    fs.mkdirSync(outDir, { recursive: true })
    const outFile = path.join(outDir, 'ic_launcher.png')
    const outFileRound = path.join(outDir, 'ic_launcher_round.png')
    console.log('Generating', outFile, size)
    await sharp(svgBuffer).resize(size, size).png().toFile(outFile)
    await sharp(svgBuffer).resize(size, size).png().toFile(outFileRound)
  }
  // playstore
  const playOut = path.join(root, 'android', 'app', 'src', 'main', 'res', 'playstore')
  fs.mkdirSync(playOut, { recursive: true })
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(playOut, 'ic_playstore.png'))
}

const iosSizes = {
  'Icon-20@2x.png': 40,
  'Icon-20@3x.png': 60,
  'Icon-29@2x.png': 58,
  'Icon-29@3x.png': 87,
  'Icon-40@2x.png': 80,
  'Icon-60@3x.png': 180,
  'Icon-76@2x.png': 152,
  'Icon-83.5@2x.png': 167,
  'Icon-1024.png': 1024,
}

async function genIOS() {
  const outDir = path.join(root, 'ios', 'MemoryFlow', 'Images.xcassets', 'AppIcon.appiconset')
  fs.mkdirSync(outDir, { recursive: true })
  for (const name of Object.keys(iosSizes)) {
    const px = iosSizes[name]
    const outFile = path.join(outDir, name)
    console.log('Generating iOS', outFile, px)
    await sharp(svgBuffer).resize(px, px).png().toFile(outFile)
  }
}

async function main() {
  try {
    await genAndroid()
    await genIOS()
    console.log('All icons generated.')
  } catch (err) {
    console.error('Error generating icons:', err)
    process.exit(1)
  }
}

main()
