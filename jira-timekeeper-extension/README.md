# 🎫 Jira → TimeKeep Extension

Chrome/Brave extension för att lägga till Jira-tickets direkt i TimeKeep med ett knapptryck!

## ✨ Features

- 🚀 **Snabb inläggning** - Ett knapptryck för att lägga till tickets
- ⏱️ **Auto-start timer** - Starta timer direkt när du lägger till
- 🎹 **Keyboard shortcut** - `Alt+T` (Windows) / `Cmd+T` (Mac)
- 📊 **Smart parsing** - Hämtar automatiskt titel, beskrivning, projekt, etc.
- 🎨 **Fin UI** - Glassmorphism design som matchar TimeKeep

## 📋 Installation i Brave/Chrome

### Steg 1: Installera Extension

1. Öppna **Brave** (eller Chrome)
2. Navigera till `brave://extensions/` (eller `chrome://extensions/`)
3. Aktivera **"Developer mode"** (längst upp till höger)
4. Klicka på **"Load unpacked"**
5. Välj mappen: `time-keep/jira-timekeeper-extension/`
6. Extension dyker upp! 🎉

### Steg 2: Konfigurera Extension

1. Klicka på extension-ikonen i toolbar
2. Klicka på **"Inställningar"** (⚙️)
3. Fyll i ditt **User ID**:
   - Logga in i TimeKeep i din webbläsare
   - Öppna Developer Console (F12)
   - Skriv: `localStorage.getItem('user')`
   - Kopiera `uid` från outputen
4. Bekräfta att **API URL** är `http://localhost:3000` (för lokal dev)
5. Klicka **"Spara inställningar"**

### Steg 3: Använd Extension!

1. Öppna en Jira-ticket på `*.atlassian.net/browse/PROJ-123`
2. Klicka på extension-ikonen (eller tryck `Alt+T`)
3. Välj:
   - **"Lägg till uppdrag"** - Lägg till utan timer
   - **"Lägg till & starta timer"** - Lägg till och börja jobba direkt!
4. Ticketen dyker upp i TimeKeep! ✨

## 🎨 Ikoner (Placeholder)

Extension behöver tre ikoner:
- `icon16.png` - 16x16 px (toolbar när litet utrymme)
- `icon48.png` - 48x48 px (extension manager)
- `icon128.png` - 128x128 px (Chrome Web Store)

**Tillfällig lösning:** 
Skapa enkla placeholders genom att spara bilder med dessa namn i extension-mappen.
Du kan använda ett online-verktyg som https://www.favicon-generator.org/ för att generera dem snabbt.

**Tips:** Använd TimeKeep-loggan eller en enkel ikon som 🎫 eller ⏱️

## 🔧 Tekniska detaljer

### Så här funkar det:

```
1. Content Script (content.js)
   ↓ Läser Jira-sidan
   ↓ Extraherar ticket-info

2. Popup (popup.html/js)
   ↓ Visar ticket-preview
   ↓ Användaren klickar "Lägg till"

3. API Call
   ↓ POST till /api/add-ticket
   ↓ Sparar i Firestore

4. TimeKeep
   ↓ Ticket dyker upp automatiskt!
   ↓ (tack vare onSnapshot-listener)
```

### Filer:

```
jira-timekeeper-extension/
├── manifest.json       # Extension config
├── content.js          # Läser Jira-sidor
├── popup.html          # UI
├── popup.js            # Popup logik
├── background.js       # Background worker
├── icon16.png          # Liten ikon
├── icon48.png          # Mellan ikon
└── icon128.png         # Stor ikon
```

## 🐛 Troubleshooting

### "Kunde inte läsa ticket-data"
- **Lösning:** Refresha Jira-sidan (F5) och försök igen
- Content script laddas när sidan laddas, om du installerade extension efter att sidan öppnats måste du refresha

### "Du måste konfigurera ditt User ID"
- **Lösning:** Öppna extension → Inställningar → Fyll i User ID
- Hitta ditt User ID genom att kolla localStorage i TimeKeep

### "Network error / Failed to fetch"
- **Lösning:** Kontrollera att TimeKeep körs på `localhost:3000`
- Starta TimeKeep: `npm run dev`

### Extension syns inte i Brave
- **Lösning:** Aktivera "Show extensions in the toolbar" i Brave
- Högerklicka på toolbar → Extensions → Pin extension

### Fungerar inte på Jira Cloud
- **Lösning:** Kontrollera att URL:en matchar `*.atlassian.net/browse/*`
- Om ditt företag har custom domain, lägg till det i `manifest.json` under `host_permissions`

## 🚀 Framtida förbättringar

- [ ] Publicera till Chrome Web Store
- [ ] Redigera ticket innan den läggs till
- [ ] Synka tillbaka tid till Jira (worklog)
- [ ] Batch-lägg till flera tickets
- [ ] Dark/Light mode toggle
- [ ] Notifikationer när timers är aktiva
- [ ] Jira Server support (inte bara Cloud)

## 💡 Tips

- **Keyboard shortcut:** Tryck `Alt+T` för snabb åtkomst!
- **Pin extension:** Högerklicka → Pin för att alltid se ikonen
- **Produktions-URL:** När du deployer TimeKeep, uppdatera API URL i inställningarna

## 📝 Kompatibilitet

- ✅ Brave Browser
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Chromium-baserade browsers
- ❌ Firefox (kräver anpassning till Manifest V2)
- ❌ Safari (kräver konvertering till Safari Extension format)

## 📄 Licens

Samma som TimeKeep-huvudprojektet.

---

Skapad med ❤️ för att spara tid på tidrapportering! ⏱️
