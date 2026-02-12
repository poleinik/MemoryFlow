Набор для генерации иконок приложения

Что сделано

- Добавлен SVG-исходник: `assets/app-icons/brain-app-icon.svg`
- Добавлен PowerShell-скрипт генерации PNG: `assets/app-icons/generate-icons.ps1`

Требования

- ImageMagick (команда `magick`) должна быть установлена и доступна в PATH.

Как сгенерировать

1. Откройте PowerShell в корне проекта.
2. Запустите:

```powershell
powershell -ExecutionPolicy Bypass -File assets/app-icons/generate-icons.ps1
```

Куда выпишет

- Android: `android/app/src/main/res/mipmap-*` (ic_launcher.png и ic_launcher_round.png)
- iOS: `ios/MemoryFlow/Images.xcassets/AppIcon.appiconset/` (набор PNG, которые можно перетащить в Xcode)

Если хотите другой цвет фона (вместо #2563eb), скажите HEX-значение, и я заменю SVG.
