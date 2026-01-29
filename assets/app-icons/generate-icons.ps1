<#
Generate app icon PNGs from the SVG source using ImageMagick (magick).

Run from project root (PowerShell):
  powershell -ExecutionPolicy Bypass -File assets/app-icons/generate-icons.ps1

This will write PNGs into:
  - android/app/src/main/res/mipmap-*/
  - ios/MemoryFlow/Images.xcassets/AppIcon.appiconset/

Ensure ImageMagick is installed and `magick` is on PATH.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$svg = Join-Path $root 'brain-app-icon.svg'
if (-not (Test-Path $svg)) { Write-Error "SVG not found: $svg"; exit 1 }

Write-Host "Using SVG: $svg"

# Android sizes (px)
$android = @{
  'mipmap-mdpi' = 48
  'mipmap-hdpi' = 72
  'mipmap-xhdpi' = 96
  'mipmap-xxhdpi' = 144
  'mipmap-xxxhdpi' = 192
}

foreach ($k in $android.Keys) {
  $size = $android[$k]
  $outDir = Join-Path (Join-Path $root '..\..\android\app\src\main\res') $k
  if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
  $outFile = Join-Path $outDir 'ic_launcher.png'
  Write-Host "Generating Android $k -> $outFile ($size)"
  magick convert -background none -resize ${size}x${size} `"$svg`" `"$outFile`"
  # round icon
  $outFileRound = Join-Path $outDir 'ic_launcher_round.png'
  magick convert -background none -resize ${size}x${size} `"$svg`" `"$outFileRound`"
}

# Play Store / high-res
$playOut = Join-Path $root '..\..\android\app\src\main\res\playstore'
if (-not (Test-Path $playOut)) { New-Item -ItemType Directory -Force -Path $playOut | Out-Null }
magick convert -background none -resize 512x512 `"$svg`" `"$(Join-Path $playOut 'ic_playstore.png')`"

# iOS sizes (common set)
$iosOut = Join-Path $root '..\..\ios\MemoryFlow\Images.xcassets\AppIcon.appiconset'
if (-not (Test-Path $iosOut)) { New-Item -ItemType Directory -Force -Path $iosOut | Out-Null }

$iosSizes = @{
  'Icon-20@1x.png' = 20
  'Icon-20@2x.png' = 40
  'Icon-20@3x.png' = 60
  'Icon-29@1x.png' = 29
  'Icon-29@2x.png' = 58
  'Icon-29@3x.png' = 87
  'Icon-40@1x.png' = 40
  'Icon-40@2x.png' = 80
  'Icon-40@3x.png' = 120
  'Icon-60@2x.png' = 120
  'Icon-60@3x.png' = 180
  'Icon-76@1x.png' = 76
  'Icon-76@2x.png' = 152
  'Icon-83.5@2x.png' = 167
  'Icon-1024.png' = 1024
}

foreach ($name in $iosSizes.Keys) {
  $px = $iosSizes[$name]
  $outFile = Join-Path $iosOut $name
  Write-Host "Generating iOS $name -> $outFile ($px)"
  magick convert -background none -resize ${px}x${px} `"$svg`" `"$outFile`"
}

Write-Host "Done. Review files in android/ and ios/ directories. Add iOS Contents.json if needed."
