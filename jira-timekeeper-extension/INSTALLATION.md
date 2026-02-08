# 📦 Installationsguide - Jira TimeKeep Extension

Följ dessa enkla steg för att installera Jira TimeKeep Extension i Brave eller Chrome!

---

## 📥 Del 1: Ladda ner och installera

### 1️⃣ Ladda ner extension
- Få zip-filen från din kollega/admin
- Packa upp zip-filen till en mapp (t.ex. på Skrivbordet)

### 2️⃣ Öppna Extensions-sidan
**I Brave:**
1. Öppna Brave
2. Skriv i adressfältet: `brave://extensions/`
3. Tryck Enter

**I Chrome:**
1. Öppna Chrome
2. Skriv i adressfältet: `chrome://extensions/`
3. Tryck Enter

### 3️⃣ Aktivera Developer Mode
- Hitta knappen **"Developer mode"** längst upp till höger
- Aktivera den (slå på toggle-knappen så den blir blå)

### 4️⃣ Läs in extension
1. Klicka på knappen **"Load unpacked"** (eller **"Läs in okomprimerat tillägg"**)
2. En filväljare öppnas
3. Navigera till mappen du packade upp (t.ex. `jira-timekeeper-extension`)
4. Klicka **"Välj mapp"** eller **"Select Folder"**

### 5️⃣ Klart!
- Extension dyker upp i listan! 🎉
- Du ser en ikon i din toolbar (längst upp till höger)

---

## 🔑 Del 2: Hitta ditt User ID

### 1️⃣ Öppna TimeKeep
- Gå till: **https://time-keeper-abra.web.app**
- Logga in med ditt Google-konto

### 2️⃣ Öppna Developer Console
- Tryck på tangenten **F12** på tangentbordet
- En panel öppnas längst ner eller till höger

### 3️⃣ Hitta User ID
- Längst upp i console-panelen ser du flera flikar (Console, Network, etc.)
- Klicka på fliken **"Console"**
- Du ser ett meddelande som börjar med: `🔑 Ditt User ID för extensionen:`
- Markera hela det långa ID:et som visas (ser ut ungefär som: `kaH3j9Kd2oP8mL1nQ5vR7wX9yZ0`)
- Kopiera det (Ctrl+C eller högerklicka → Copy)

### 4️⃣ Stäng Console
- Tryck **F12** igen för att stänga console

---

## ⚙️ Del 3: Konfigurera extension

### 1️⃣ Öppna extension
- Klicka på extension-ikonen i toolbar (längst upp till höger i Brave/Chrome)
- En popup öppnas

### 2️⃣ Gå till inställningar
- Klicka på **⚙️ Inställningar** längst ner i popup:en

### 3️⃣ Klistra in User ID
- I fältet **"User ID"**: Klistra in det ID du kopierade (Ctrl+V)

### 4️⃣ Kontrollera API URL
- I fältet **"API URL"** ska det stå: `https://time-keeper-abra.web.app`
- Om det står något annat, ändra till rätt URL

### 5️⃣ Spara
- Klicka på **"Spara inställningar"**
- Du ser ett meddelande: "Inställningar sparade!"
- Klicka på **"Tillbaka"**

---

## ✅ Del 4: Testa extension!

### 1️⃣ Öppna en Jira-ticket
- Gå till din Jira-portal (t.ex. `https://dittforetag.atlassian.net`)
- Öppna en ticket (vanlig Jira eller Service Desk)

### 2️⃣ Använd extension
- Klicka på extension-ikonen (eller tryck **Alt+T**)
- Du ser ticket-information i popup:en

### 3️⃣ Lägg till i TimeKeep
- Klicka antingen:
  - **"✚ Lägg till uppdrag"** - Lägger till utan att starta timer
  - **"▶ Lägg till & starta timer"** - Lägger till OCH startar timer direkt

### 4️⃣ Kontrollera TimeKeep
- Öppna TimeKeep i en annan flik
- Din ticket ska nu synas i listan! 🎉

---

## 🆘 Behöver du hjälp?

**Extension hittar ingen ticket:**
- Prova att refresha Jira-sidan (F5) och klicka på extension igen

**"Du måste konfigurera ditt User ID":**
- Gå tillbaka till Del 2 och 3 ovan och följ stegen igen

**Ticket läggs inte till i TimeKeep:**
- Kontrollera att du är inloggad i TimeKeep
- Kontrollera att ditt User ID är korrekt
- Kontrollera att API URL är: `https://time-keeper-abra.web.app`

**Annat problem?**
- Kontakta din admin eller IT-support

---

## 🎉 Nu är du redo att använda extensionen!

Lycka till med din tidsregistrering! ⏱️
