# 🔑 Firebase Admin SDK Setup Guide

Guide för att sätta upp Firebase Admin SDK credentials för Jira Extension API.

---

## 📋 Varför behövs detta?

Din Jira Extension API behöver **Firebase Admin SDK** för att kunna skriva till Firestore från servern (bypass security rules). Detta kräver service account credentials.

---

## 🚀 Setup för Development

###  Steg 1: Hämta Service Account Key

1. Gå till [Firebase Console](https://console.firebase.google.com/)
2. Välj ditt projekt: **time-keeper-abra**
3. Klicka på **⚙️ (Inställningar)** → **Project settings**
4. Gå till fliken **Service accounts**
5. Klicka **Generate new private key**
6. Klicka **Generate key** i dialogen
7. En JSON-fil laddas ner (t.ex. `time-keeper-abra-firebase-adminsdk-xxxxx.json`)

### ⚠️ VIKTIGT: Håll denna fil hemlig!
- ❌ Commita ALDRIG service account key till git
- ❌ Dela ALDRIG publikt
- ✅ Förvara säkert lokalt

---

### Steg 2: Lägg till i .env.local

1. Öppna den nedladdade JSON-filen
2. Hitta dessa fält:
   - `client_email`
   - `private_key`

3. Öppna `.env.local` i ditt projekt
4. Lägg till dessa rader (avkommentera och fyll i):

```bash
# Firebase Admin SDK
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@time-keeper-abra.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

**Tips:** Kopiera hela `private_key` värdet inklusive `"` och radbrytningar (`\n`)

---

### Steg 3: Starta om dev-servern

```powershell
npm run dev
```

Nu ska extensionen kunka lägga till tickets! 🎉

---

## 🌐 Setup för Production (GitHub Actions)

### Steg 1: Lägg till GitHub Secrets

1. Gå till ditt GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Lägg till dessa secrets:

| Name | Value |
|------|-------|
| `FIREBASE_ADMIN_CLIENT_EMAIL` | client_email från service account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | private_key från service account JSON |

### Steg 2: Uppdatera workflow-fil

Filen `.github/workflows/firebase-hosting-merge.yml` behöver uppdateras för att inkludera dessa secrets. (Redan gjort! ✅)

---

## 🧪 Testa

### Test lokalt:

1. Logga in i TimeKeep
2. Kopiera ditt User ID från console
3. Uppdatera inställningar i extensionen
4. Gå till en Jira-ticket
5. Klicka på extensionen och lägg till ticket
6. Kontrollera att den dyker upp i TimeKeep! ✅

### Test efter deployment:

När du mergar till main och GitHub Actions deployar:
- Extension ska funka för alla användare
- Tickets ska sparas korrekt i Firestore

---

## 🔒 Säkerhet

### Bra att veta:

- **Service account har full access** till ditt Firebase-projekt
- API:et (`/api/add-ticket`) använder Admin SDK för att bypassa security rules
- Detta är säkert eftersom:
  - ✅ API:et validerar User ID
  - ✅ Service account credentials är hemliga
  - ✅ Endast folk med giltigt User ID kan lägga till tickets

### För extra säkerhet:

Du kan lägga till ytterligare validering i `/api/add-ticket`:
- Kolla att User ID finns i `userProfiles` collection
- Rate limiting
- IP whitelisting

---

## ❓ Troubleshooting

### "Firebase Admin SDK initialization error"
- ✅ Kontrollera att `.env.local` har rätt format
- ✅ Kontrollera att private key har `\n` (radbrytningar)
- ✅ Starta om dev-servern efter att ha ändrat `.env.local`

### "Missing or insufficient permissions" (fortfarande)
- ✅ Kontrollera att Admin SDK är korrekt initierat (kolla console logs)
- ✅ Kontrollera att `FIREBASE_ADMIN_CLIENT_EMAIL` och `FIREBASE_ADMIN_PRIVATE_KEY` är satta

### Extension fungerar lokalt men inte i production
- ✅ Kontrollera att GitHub Secrets är korrekt satta
- ✅ Kolla GitHub Actions logs för felmeddelanden

---

## 📚 Mer info

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Service Accounts Explained](https://firebase.google.com/docs/admin/setup#initialize-sdk)

---

**Nu är du redo att använda Jira Extension både lokalt och i production!** 🚀
