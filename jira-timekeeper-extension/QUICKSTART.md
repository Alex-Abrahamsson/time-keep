# 🚀 SNABBSTART - TimeKeep Jira Extension

Följ dessa 5 steg för att få igång extension på 5 minuter!

## ✅ Checklista

- [ ] **Steg 1:** Skapa ikoner
- [ ] **Steg 2:** Installera extension i Brave
- [ ] **Steg 3:** Starta TimeKeep-appen
- [ ] **Steg 4:** Konfigurera extension
- [ ] **Steg 5:** Testa!

---

## 📝 Steg 1: Skapa Ikoner (2 min)

### Enklaste sättet - Tomma placeholders:

Öppna PowerShell i denna mapp och kör:

```powershell
# Skapa enkla 1x1 PNG-placeholders (funkar för testing!)
[System.IO.File]::WriteAllBytes("$PWD\icon16.png", @(137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,10,73,68,65,84,120,156,99,0,1,0,0,5,0,1,13,10,45,180,0,0,0,0,73,69,78,68,174,66,96,130))
Copy-Item icon16.png icon48.png
Copy-Item icon16.png icon128.png
```

**Eller** följ [HOW_TO_CREATE_ICONS.md](HOW_TO_CREATE_ICONS.md) för att skapa riktiga ikoner.

---

## 🔧 Steg 2: Installera Extension (1 min)

1. Öppna Brave
2. Gå till `brave://extensions/`
3. Aktivera **"Developer mode"** (toggle längst upp till höger)
4. Klicka **"Load unpacked"**
5. Välj mappen: `c:\Users\AlexA\Documents\Git\time-keep\jira-timekeeper-extension`
6. ✅ Extension installerad!

**Tips:** Pin extension till toolbar för snabb åtkomst (högerklicka på puzzle-ikonen → Pin)

---

## 💻 Steg 3: Starta TimeKeep (30 sek)

Öppna en ny PowerShell i TimeKeep-mappen:

```powershell
cd c:\Users\AlexA\Documents\Git\time-keep
npm run dev
```

Vänta tills du ser: `✓ Ready in XXXms`

Håll detta fönster öppet!

---

## ⚙️ Steg 4: Konfigurera Extension (1 min)

### Hämta ditt User ID:

1. Öppna TimeKeep i din webbläsare: http://localhost:3000
2. Logga in
3. Tryck **F12** (öppna Developer Tools)
4. Gå till **Console**-tabben
5. Kör detta kommando:
   ```javascript
   JSON.parse(localStorage.getItem('user')).uid
   ```
6. Kopiera resultatet (ex: `abc123xyz`)

### Konfigurera Extension:

1. Klicka på extension-ikonen i Brave
2. Klicka **"Inställningar"** (⚙️)
3. Klistra in ditt **User ID**
4. Kontrollera att **API URL** är: `http://localhost:3000`
5. Klicka **"Spara inställningar"**

---

## 🎉 Steg 5: Testa! (30 sek)

1. Öppna en Jira-ticket på ditt företags Jira:
   ```
   https://DITTFÖRETAG.atlassian.net/browse/PROJ-123
   ```

2. Klicka på extension-ikonen (eller tryck `Alt+T`)

3. Du ser ticket-infon!

4. Välj:
   - **"Lägg till uppdrag"** = Lägg till utan timer
   - **"Lägg till & starta timer"** = Börja jobba direkt! ⏱️

5. Öppna TimeKeep - ticketen är där! 🎊

---

## 🐛 Problem?

### "Kunde inte läsa ticket-data"
→ Refresha Jira-sidan (F5) och försök igen

### "Du måste konfigurera ditt User ID"
→ Gå tillbaka till Steg 4 och hämta ditt User ID

### "Failed to fetch"
→ Kontrollera att TimeKeep körs (`npm run dev` i annan terminal)

### Extension syns inte
→ Klicka på puzzle-ikonen i Brave → Pin extension

### Fungerar inte på mitt Jira
→ I `manifest.json`, lägg till din Jira-URL under `host_permissions`:
```json
"host_permissions": [
  "https://DITTFÖRETAG.atlassian.net/*",
  "http://localhost:3000/*"
]
```

---

## 🎹 Keyboard Shortcuts

- `Alt+T` (Windows) / `Cmd+T` (Mac) = Öppna extension snabbt!

---

## 🚀 Nästa steg

- [ ] Skapa riktiga ikoner (se [HOW_TO_CREATE_ICONS.md](HOW_TO_CREATE_ICONS.md))
- [ ] Testa på jobbet med riktiga Jira-tickets
- [ ] Deploy TimeKeep till produktion (Vercel)
- [ ] Uppdatera API URL i extension-inställningar

---

## 📚 Mer info

- Full dokumentation: [README.md](README.md)
- Hur det funkar: [README.md#tekniska-detaljer](README.md#-tekniska-detaljer)
- Troubleshooting: [README.md#troubleshooting](README.md#-troubleshooting)

---

**Lycka till! 🎉**

Frågor? Lägg till en issue eller kontakta mig!
