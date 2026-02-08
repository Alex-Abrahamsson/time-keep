# 📤 Distributionsguide för Jira TimeKeep Extension

Guide för dig som ska dela ut extensionen till kollegor.

---

## 🎯 Översikt

Du har två enkla sätt att dela ut extensionen:
1. **Zippa och dela via Teams/Email** (Snabbast!)
2. **Via GitHub Releases** (Mer organiserat)

---

## ✅ Metod 1: Zippa och dela (Rekommenderat)

### Steg 1: Skapa en ren zip-fil

**Från projektmappen:**

```powershell
# Öppna PowerShell i projektroten
cd c:\Users\AlexA\Documents\Git\time-keep\

# Kopiera extension-mappen till en temporär plats
Copy-Item -Path "jira-timekeeper-extension" -Destination "temp-extension" -Recurse

# Ta bort utvecklarfiler
Remove-Item "temp-extension\.git" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "temp-extension\QUICKSTART.md" -Force -ErrorAction SilentlyContinue
Remove-Item "temp-extension\HOW_TO_CREATE_ICONS.md" -Force -ErrorAction SilentlyContinue
Remove-Item "temp-extension\ICONS_NEEDED.html" -Force -ErrorAction SilentlyContinue
Remove-Item "temp-extension\icon128.svg" -Force -ErrorAction SilentlyContinue

# Skapa zip
Compress-Archive -Path "temp-extension\*" -DestinationPath "jira-timekeeper-extension.zip" -Force

# Rensa temp
Remove-Item "temp-extension" -Recurse -Force

# Klar! zip-filen är nu i projektroten
```

### Steg 2: Dela zip-filen

**Via Teams:**
1. Ladda upp `jira-timekeeper-extension.zip` i ett team-kanal
2. Dela länken till [INSTALLATION.md](jira-timekeeper-extension/INSTALLATION.md) (eller kopiera innehållet till ett Teams-meddelande)

**Via Email:**
1. Bifoga `jira-timekeeper-extension.zip`
2. Bifoga eller kopiera innehållet från [INSTALLATION.md](jira-timekeeper-extension/INSTALLATION.md)

**Via SharePoint:**
1. Ladda upp `jira-timekeeper-extension.zip` till en delad mapp
2. Dela länken

---

## 🔄 Metod 2: Via GitHub Releases

### Steg 1: Skapa en Release på GitHub

1. Gå till ditt GitHub-repo
2. Klicka på **"Releases"** (högersidan)
3. Klicka **"Draft a new release"**
4. Fyll i:
   - **Tag version**: `v1.0.0` (eller senaste version)
   - **Release title**: `Jira TimeKeep Extension v1.0.0`
   - **Description**:
     ```markdown
     ## 🎫 Jira TimeKeep Extension v1.0.0
     
     Chrome/Brave extension för att lägga till Jira-tickets direkt i TimeKeep!
     
     ### 📥 Installation
     1. Ladda ner `jira-timekeeper-extension.zip` nedan
     2. Följ instruktionerna i [INSTALLATION.md](https://github.com/[ditt-repo]/time-keep/blob/main/jira-timekeeper-extension/INSTALLATION.md)
     
     ### ✨ Features
     - ✅ Fungerar med både vanlig Jira och Service Desk
     - ✅ Auto-start timer
     - ✅ Keyboard shortcut (Alt+T)
     ```

### Steg 2: Ladda upp zip-fil

1. Under **"Attach binaries"**, dra och släpp din `jira-timekeeper-extension.zip`
2. Klicka **"Publish release"**

### Steg 3: Dela länken

Dela release-länken med kollegor:
```
https://github.com/[ditt-username]/time-keep/releases/latest
```

---

## 📝 Viktigt att kommunicera till användare

När du delar ut extensionen, inkludera alltid:

### ✅ Checklista för meddelandet:

- [ ] **Zip-fil** (eller länk till GitHub Release)
- [ ] **Installationsinstruktioner** (dela INSTALLATION.md)
- [ ] **TimeKeep URL**: `https://time-keeper-abra.web.app`
- [ ] **Instruktion för att hitta User ID**:
  - Logga in i TimeKeep
  - Tryck F12
  - Kopiera User ID från Console
- [ ] **Support-kontakt** (vem ska de kontakta vid problem?)

### 📧 Exempel på meddelande:

```
Hej alla!

Jag har skapat en Chrome/Brave extension som gör det superenkelt att föra över 
Jira-tickets till TimeKeep med ett knapptryck! ⚡

📥 Installation:
1. Ladda ner bifogad zip-fil (eller från [länk])
2. Följ instruktionerna (se bifogad INSTALLATION.md)

🔑 Du behöver ditt User ID:
- Logga in på https://time-keeper-abra.web.app
- Tryck F12
- Kopiera User ID från Console-meddelandet

❓ Frågor?
Kontakta mig om du stöter på problem!

Mvh,
[Ditt namn]
```

---

## 🔄 När du uppdaterar extensionen

### För framtida uppdateringar:

1. Uppdatera `version` i `manifest.json`:
   ```json
   "version": "1.1.0"
   ```

2. Skapa ny zip-fil (kör samma PowerShell-kommandon ovan)

3. Dela ny zip med changelog:
   ```markdown
   ## v1.1.0 - Uppdatering
   
   ### Nytt:
   - Feature X
   
   ### Fixat:
   - Bug Y
   
   Ladda ner och installera på samma sätt som förra gången!
   ```

---

## 💡 Tips

- **Testa själv först**: Installera från zip-filen för att säkerställa att den funkar
- **Ha en FAQ**: Samla vanliga frågor och svar
- **Versionshantering**: Använd GitHub Releases för att hålla koll på ändringar
- **Snabb support**: Håll utkik efter feedback första dagarna efter utdelning

---

## 🎉 Lycka till med distributionen!
