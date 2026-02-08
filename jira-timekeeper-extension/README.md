# 🎫 Jira → TimeKeep Extension

Chrome/Brave extension för att lägga till Jira-tickets direkt i TimeKeep med ett knapptryck!

## ✨ Features

- 🚀 **Snabb inläggning** - Ett knapptryck för att lägga till tickets
- ⏱️ **Auto-start timer** - Starta timer direkt när du lägger till
- 🎹 **Keyboard shortcut** - `Alt+T` (Windows) / `Cmd+T` (Mac)
- 📊 **Smart parsing** - Hämtar automatiskt titel, beskrivning, projekt, etc.
- 🎨 **Fin UI** - Glassmorphism design som matchar TimeKeep
- 🔥 **Service Desk-stöd** - Fungerar med både vanlig Jira och Service Desk

---

## 📦 Installation för Kollegor

### Steg 1: Ladda ner Extension

**Alternativ A: Via GitHub**
1. Gå till [GitHub Releases](https://github.com/[ditt-repo]/time-keep/releases) (eller dela zip-fil direkt)
2. Ladda ner senaste versionen av `jira-timekeeper-extension.zip`
3. Packa upp zip-filen till en valfri mapp

**Alternativ B: Via Teams/Email**
1. Få zip-filen från din kollega/admin
2. Packa upp zip-filen till en valfri mapp

### Steg 2: Installera i Brave/Chrome

1. Öppna **Brave** (eller Chrome)
2. Skriv i adressfältet: `brave://extensions/` (eller `chrome://extensions/`)
3. Aktivera **"Developer mode"** (toggle längst upp till höger)
4. Klicka på **"Load unpacked"** (Läs in okomprimerat tillägg)
5. Välj den uppackade `jira-timekeeper-extension` mappen
6. Extension visas nu i listan! 🎉

### Steg 3: Hitta ditt User ID

1. Öppna TimeKeep i webbläsaren: [https://time-keeper-abra.web.app](https://time-keeper-abra.web.app)
2. Logga in med Google
3. Tryck `F12` för att öppna Developer Console
4. Gå till fliken **Console**
5. Du ska se ett meddelande: `🔑 Ditt User ID för extensionen: [långt-id]`
6. **Kopiera hela User ID:et** (markera och Ctrl+C)

### Steg 4: Konfigurera Extension

1. Klicka på extension-ikonen i din toolbar (längst upp till höger)
2. Klicka på **⚙️ Inställningar**
3. Klistra in ditt **User ID**
4. Kontrollera att **API URL** är: `https://time-keeper-abra.web.app`
5. Klicka **"Spara inställningar"**
6. Klart! 🎉

### Steg 5: Använd Extension!

1. Öppna en Jira-ticket (vanlig Jira eller Service Desk):
   - Vanlig: `*.atlassian.net/browse/PROJ-123`
   - Service Desk: `*.atlassian.net/jira/servicedesk/projects/TICKET/...`
2. Klicka på extension-ikonen (eller tryck `Alt+T`)
3. Välj:
   - **"Lägg till uppdrag"** - Lägg till utan timer
   - **"Lägg till & starta timer"** - Lägg till och börja jobba direkt!
4. Ticketen dyker upp i TimeKeep! ✨

---

## 🐛 Felsökning

### Extension hittar ingen ticket
- ✅ Kontrollera att du är på en Jira-sida
- ✅ Prova att refresha sidan (F5) och klicka på extension igen
- ✅ Fungerar med både vanlig Jira och Service Desk

### "Du måste konfigurera ditt User ID"
- ✅ Gå till Inställningar och klistra in ditt User ID
- ✅ Se Steg 3 ovan för hur du hittar det

### Ticket läggs inte till i TimeKeep
- ✅ Kontrollera att API URL är korrekt: `https://time-keeper-abra.web.app`
- ✅ Kontrollera att ditt User ID är korrekt
- ✅ Prova att logga in i TimeKeep i en annan flik först

---

## 👨‍💻 För Utvecklare

Se [QUICKSTART.md](QUICKSTART.md) för utvecklingsinstruktioner.

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
