# 🎨 Skapa Ikoner för Extension

Extension behöver PNG-ikoner för att fungera korrekt. Här är snabbaste sättet att fixa det:

## ⚡ Snabbaste sättet (2 minuter)

### Metod 1: Online Converter
1. Öppna https://cloudconvert.com/svg-to-png
2. Ladda upp `icon128.svg` (finns i denna mapp)
3. Konvertera till PNG
4. Spara som `icon128.png`
5. Upprepa och ändra storlek till 48x48 → `icon48.png`
6. Upprepa och ändra storlek till 16x16 → `icon16.png`

### Metod 2: Använd emoji som ikon
1. Gå till https://favicon.io/emoji-favicons/ticket/
2. Välj 🎫 eller ⏱️ emoji
3. Ladda ner paketet
4. Byt namn på filerna till icon16.png, icon48.png, icon128.png

### Metod 3: Photoshop/GIMP/Figma
1. Öppna `icon128.svg` 
2. Exportera som PNG i 3 storlekar:
   - 16x16px → icon16.png
   - 48x48px → icon48.png
   - 128x128px → icon128.png

## 🖼️ Design tips

En bra extension-ikon är:
- **Enkel** - Lätt att känna igen i liten storlek
- **Färgglad** - Står ut bland andra extensions
- **Relevant** - Relaterar till app:ens funktion

Förslag:
- ⏱️ Timer/Klocka (visar att det handlar om tidsspårning)
- 🎫 Ticket (visar att det är Jira-relaterat)
- ▶️ Play-knapp (visar att det startar något)
- Eller TimeKeep-loggan om du har en!

## 🚀 Snabb-test utan ikoner

Om du vill testa extensionen DIREKT utan att fixa ikoner:

1. Skapa 3 tomma filer:
```bash
# I PowerShell/Terminal i extension-mappen:
New-Item icon16.png
New-Item icon48.png  
New-Item icon128.png
```

2. Ladda extension ändå - den kommer visa en default Chrome-ikon

3. Fixa riktiga ikoner senare!

## ✅ Verifiering

När du har PNG-filerna:
```
jira-timekeeper-extension/
├── icon16.png   (16x16 pixels)
├── icon48.png   (48x48 pixels)
└── icon128.png  (128x128 pixels)
```

Kör i PowerShell:
```powershell
Get-ChildItem *.png | ForEach-Object { "$($_.Name): $((Get-Item $_.FullName).Length) bytes" }
```

## 💡 Pro tip

För bästa resultat:
- Använd transparenta bakgrunder
- Optimera PNG-filerna (https://tinypng.com/)
- Testa hur ikonen ser ut i både light och dark mode

---

Har du frågor? Fråga mig! 🚀
