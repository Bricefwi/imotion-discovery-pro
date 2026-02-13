# 🔐 Guide de Configuration OAuth - IMOTION Discovery Pro

Ce guide vous accompagne pas à pas pour configurer l'authentification OAuth avec Google, Microsoft et Apple.

---

## 📋 Vue d'ensemble

Vous allez créer 3 applications OAuth :
- **Google OAuth** : Via Google Cloud Console
- **Microsoft OAuth** : Via Azure Portal
- **Apple OAuth** : Via Apple Developer Portal (compte payant requis)

Pour chaque provider, vous obtiendrez :
- **Client ID** : Identifiant public de votre application
- **Client Secret** : Clé secrète pour authentifier les requêtes

---

## 🔵 1. Google OAuth (Google Cloud Console)

### Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Sélectionner un projet"** en haut à gauche
4. Cliquez sur **"Nouveau projet"**
5. Nom du projet : `IMOTION Discovery Pro`
6. Cliquez sur **"Créer"**

### Étape 2 : Activer l'API Google+

1. Dans le menu latéral, allez dans **"API et services" > "Bibliothèque"**
2. Recherchez **"Google+ API"**
3. Cliquez sur **"Google+ API"**
4. Cliquez sur **"Activer"**

### Étape 3 : Configurer l'écran de consentement OAuth

1. Dans le menu latéral, allez dans **"API et services" > "Écran de consentement OAuth"**
2. Sélectionnez **"Externe"** (pour permettre à tous les utilisateurs de se connecter)
3. Cliquez sur **"Créer"**

**Remplissez les informations :**
- **Nom de l'application** : `IMOTION Discovery Pro`
- **E-mail d'assistance utilisateur** : Votre email
- **Logo de l'application** : (Optionnel) Uploadez le logo IMOTION
- **Domaine de l'application** : `https://3000-iobctsosc8k1fsr4s182a-d2458a2e.us2.manus.computer` (ou votre domaine personnalisé)
- **Domaines autorisés** : Ajoutez votre domaine
- **Coordonnées du développeur** : Votre email

4. Cliquez sur **"Enregistrer et continuer"**

**Champs d'application (Scopes) :**
- Cliquez sur **"Ajouter ou supprimer des champs d'application"**
- Sélectionnez :
  * `userinfo.email`
  * `userinfo.profile`
  * `openid`
- Cliquez sur **"Mettre à jour"**
- Cliquez sur **"Enregistrer et continuer"**

5. **Utilisateurs de test** : Ajoutez votre email pour tester
6. Cliquez sur **"Enregistrer et continuer"**
7. Cliquez sur **"Retour au tableau de bord"**

### Étape 4 : Créer les identifiants OAuth

1. Dans le menu latéral, allez dans **"API et services" > "Identifiants"**
2. Cliquez sur **"Créer des identifiants"** > **"ID client OAuth"**
3. Type d'application : **"Application Web"**
4. Nom : `IMOTION Discovery Pro Web`

**URIs de redirection autorisés** :
```
https://3000-iobctsosc8k1fsr4s182a-d2458a2e.us2.manus.computer/auth/callback/google
```

⚠️ **Important** : Remplacez par votre URL de production si vous avez un domaine personnalisé.

5. Cliquez sur **"Créer"**

### Étape 5 : Récupérer les credentials

Une popup s'affiche avec :
- **ID client** : Copiez-le (commence par `xxx.apps.googleusercontent.com`)
- **Code secret du client** : Copiez-le

✅ **Conservez ces informations** pour la configuration finale.

---

## 🔷 2. Microsoft OAuth (Azure Portal)

### Étape 1 : Créer une application Azure AD

1. Allez sur [Azure Portal](https://portal.azure.com/)
2. Connectez-vous avec votre compte Microsoft
3. Dans la barre de recherche, tapez **"Azure Active Directory"**
4. Cliquez sur **"Inscriptions d'applications"** dans le menu latéral
5. Cliquez sur **"Nouvelle inscription"**

**Remplissez les informations :**
- **Nom** : `IMOTION Discovery Pro`
- **Types de comptes pris en charge** : Sélectionnez **"Comptes dans un annuaire organisationnel et comptes Microsoft personnels"**
- **URI de redirection** :
  * Type : **Web**
  * URL : `https://3000-iobctsosc8k1fsr4s182a-d2458a2e.us2.manus.computer/auth/callback/microsoft`

6. Cliquez sur **"Inscrire"**

### Étape 2 : Récupérer l'Application (client) ID

1. Sur la page de l'application, vous verrez **"ID d'application (client)"**
2. **Copiez cet ID** (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Étape 3 : Créer un Client Secret

1. Dans le menu latéral de l'application, cliquez sur **"Certificats et secrets"**
2. Cliquez sur **"Nouveau secret client"**
3. **Description** : `IMOTION Discovery Pro Secret`
4. **Expire** : Choisissez **"24 mois"** (ou selon vos besoins)
5. Cliquez sur **"Ajouter"**

### Étape 4 : Récupérer le Client Secret

⚠️ **ATTENTION** : Le secret ne s'affiche qu'une seule fois !

1. **Copiez immédiatement la "Valeur"** du secret (pas l'ID)
2. Conservez-le en lieu sûr

### Étape 5 : Configurer les permissions API

1. Dans le menu latéral, cliquez sur **"Autorisations de l'API"**
2. Vérifiez que les permissions suivantes sont présentes :
   - `User.Read` (Microsoft Graph)
   - `openid`
   - `profile`
   - `email`

Si elles ne sont pas présentes :
1. Cliquez sur **"Ajouter une autorisation"**
2. Sélectionnez **"Microsoft Graph"**
3. Sélectionnez **"Autorisations déléguées"**
4. Cochez : `User.Read`, `openid`, `profile`, `email`
5. Cliquez sur **"Ajouter des autorisations"**

✅ **Conservez l'Application ID et le Client Secret** pour la configuration finale.

---

## 🍎 3. Apple OAuth (Apple Developer)

⚠️ **Prérequis** : Vous devez avoir un **compte Apple Developer** (99$/an).

### Étape 1 : Créer un App ID

1. Allez sur [Apple Developer Portal](https://developer.apple.com/account/)
2. Connectez-vous avec votre compte Apple Developer
3. Dans le menu latéral, cliquez sur **"Certificates, Identifiers & Profiles"**
4. Cliquez sur **"Identifiers"**
5. Cliquez sur le bouton **"+"** pour créer un nouvel identifiant
6. Sélectionnez **"App IDs"** et cliquez sur **"Continue"**
7. Sélectionnez **"App"** et cliquez sur **"Continue"**

**Remplissez les informations :**
- **Description** : `IMOTION Discovery Pro`
- **Bundle ID** : Sélectionnez **"Explicit"** et entrez : `com.imotion.discovery-pro`
- **Capabilities** : Cochez **"Sign in with Apple"**

8. Cliquez sur **"Continue"** puis **"Register"**

### Étape 2 : Créer un Services ID

1. Retournez sur **"Identifiers"**
2. Cliquez sur le bouton **"+"**
3. Sélectionnez **"Services IDs"** et cliquez sur **"Continue"**

**Remplissez les informations :**
- **Description** : `IMOTION Discovery Pro Web`
- **Identifier** : `com.imotion.discovery-pro.web`

4. Cochez **"Sign in with Apple"**
5. Cliquez sur **"Configure"** à côté de "Sign in with Apple"

**Configuration Sign in with Apple :**
- **Primary App ID** : Sélectionnez `com.imotion.discovery-pro`
- **Domains and Subdomains** : Ajoutez votre domaine (ex: `iobctsosc8k1fsr4s182a-d2458a2e.us2.manus.computer`)
- **Return URLs** : Ajoutez :
  ```
  https://3000-iobctsosc8k1fsr4s182a-d2458a2e.us2.manus.computer/auth/callback/apple
  ```

6. Cliquez sur **"Save"**
7. Cliquez sur **"Continue"** puis **"Register"**

### Étape 3 : Créer une Key pour Sign in with Apple

1. Dans le menu latéral, cliquez sur **"Keys"**
2. Cliquez sur le bouton **"+"**
3. **Key Name** : `IMOTION Discovery Pro Key`
4. Cochez **"Sign in with Apple"**
5. Cliquez sur **"Configure"** à côté de "Sign in with Apple"
6. **Primary App ID** : Sélectionnez `com.imotion.discovery-pro`
7. Cliquez sur **"Save"**
8. Cliquez sur **"Continue"** puis **"Register"**

### Étape 4 : Télécharger la clé privée

⚠️ **ATTENTION** : La clé ne peut être téléchargée qu'une seule fois !

1. Cliquez sur **"Download"**
2. Conservez le fichier `.p8` en lieu sûr
3. Notez le **Key ID** affiché sur la page

### Étape 5 : Récupérer le Team ID

1. En haut à droite de la page, cliquez sur votre nom
2. Vous verrez votre **Team ID** (format : `XXXXXXXXXX`)
3. **Copiez ce Team ID**

### Informations à conserver pour Apple OAuth :

✅ **Client ID** : `com.imotion.discovery-pro.web` (Services ID)
✅ **Team ID** : Votre Team ID (10 caractères)
✅ **Key ID** : L'ID de la clé créée (10 caractères)
✅ **Private Key** : Le contenu du fichier `.p8` téléchargé

⚠️ **Note** : L'implémentation Apple OAuth est plus complexe car elle nécessite la génération d'un JWT avec la clé privée. Le Client Secret pour Apple doit être généré côté serveur.

---

## 🔧 Configuration dans IMOTION Discovery Pro

Une fois que vous avez récupéré tous les credentials, fournissez-les moi et je les configurerai via `webdev_request_secrets` :

### Google OAuth
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

### Microsoft OAuth
```
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Apple OAuth
```
APPLE_CLIENT_ID=com.imotion.discovery-pro.web
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----
```

---

## ✅ Checklist de vérification

Avant de me fournir les credentials, vérifiez :

**Google :**
- [ ] Projet Google Cloud créé
- [ ] API Google+ activée
- [ ] Écran de consentement configuré
- [ ] ID client OAuth créé
- [ ] URI de redirection configurée
- [ ] Client ID et Client Secret récupérés

**Microsoft :**
- [ ] Application Azure AD créée
- [ ] Application ID récupéré
- [ ] Client Secret créé et récupéré
- [ ] URI de redirection configurée
- [ ] Permissions API configurées

**Apple :**
- [ ] App ID créé avec Sign in with Apple
- [ ] Services ID créé et configuré
- [ ] Key créée et téléchargée
- [ ] Team ID, Key ID et Private Key récupérés
- [ ] Return URL configurée

---

## 🚀 Prochaines étapes

1. **Suivez ce guide** pour créer les 3 applications OAuth
2. **Récupérez tous les credentials** (Client ID, Client Secret, etc.)
3. **Fournissez-moi les credentials** et je les configurerai dans l'application
4. **Testez l'authentification** sur chaque provider

---

## 📞 Support

Si vous rencontrez des difficultés lors de la configuration, n'hésitez pas à me demander de l'aide ! Je peux vous guider étape par étape.

---

**Date de création** : 13 février 2026  
**Version** : 1.0  
**Projet** : IMOTION Discovery Pro
