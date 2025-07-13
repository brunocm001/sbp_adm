# SocialBoost Pro - Panneau d'Administration

Un panneau d'administration web moderne et sécurisé pour SocialBoost Pro, construit avec Astro et Tailwind CSS.

## 🚀 Fonctionnalités

### Gestion des Plateformes
- Liste des plateformes
- Création, modification, suppression
- Gestion du statut actif/inactif

### Gestion des Services
- Liste de tous les services
- Création, modification, suppression
- Association avec les plateformes
- Gestion des prix

### Gestion des Types de Services
- CRUD complet sur les types
- Association avec services ou plateformes

### Commandes
- Visualisation de toutes les commandes
- Pagination et filtres
- Modification du statut des commandes
- Recherche par ID ou utilisateur

### Paiements
- Suivi de tous les paiements
- Affichage détaillé des paiements
- Filtrage par statut

### Tickets de Support
- Liste de tous les tickets
- Réponse aux tickets
- Changement de statut (ouvert, en cours, résolu, fermé)
- Gestion des priorités

### Gestion des Administrateurs
- Liste des administrateurs
- Ajout/suppression d'administrateurs
- Modification des rôles (SuperAdmin, Admin, Support)

## 🛠️ Technologies Utilisées

- **Astro** - Framework web moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **React** - Pour les composants interactifs
- **TypeScript** - Typage statique
- **Fetch API** - Communication avec le backend

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd sbp_admin
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir l'application**
   L'application sera disponible à l'adresse : `http://localhost:3000`

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
PUBLIC_API_URL=https://sbpapi-production.up.railway.app
```

### Configuration Astro

Le fichier `astro.config.mjs` contient la configuration principale :

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  server: {
    port: 3000,
    host: true
  }
});
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants React réutilisables
│   ├── Dashboard.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── LoadingSpinner.tsx
│   ├── Toast.tsx
│   ├── ToastContainer.tsx
│   ├── PlatformsManager.tsx
│   ├── ServicesManager.tsx
│   ├── ServiceTypesManager.tsx
│   ├── OrdersManager.tsx
│   ├── PaymentsManager.tsx
│   ├── TicketsManager.tsx
│   └── AdminsManager.tsx
├── layouts/            # Layouts Astro
│   └── Layout.astro
├── pages/              # Pages de l'application
│   ├── index.astro
│   ├── login.astro
│   ├── platforms.astro
│   ├── services.astro
│   ├── service-types.astro
│   ├── orders.astro
│   ├── payments.astro
│   ├── tickets.astro
│   └── admins.astro
├── stores/             # Stores pour la gestion d'état
│   └── authStore.ts
└── utils/              # Utilitaires et API
    └── api.ts
```

## 🔐 Authentification

L'application utilise un système d'authentification par token JWT :

1. **Connexion** : Les administrateurs se connectent via la page `/login`
2. **Token** : Le token JWT est stocké dans le localStorage
3. **Autorisation** : Toutes les requêtes API incluent le token dans les headers
4. **Déconnexion** : Le token est supprimé lors de la déconnexion

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Palette personnalisée avec des couleurs primaires et secondaires
- **Typographie** : Police Inter pour une meilleure lisibilité
- **Composants** : Design cohérent avec Tailwind CSS
- **Responsive** : Interface adaptée mobile, tablette et desktop

### Navigation
- **Sidebar** : Navigation latérale avec icônes et labels
- **Header** : Barre supérieure avec titre et menu mobile
- **Breadcrumbs** : Navigation contextuelle

## 📱 Responsive Design

L'application est entièrement responsive :

- **Mobile** : Sidebar rétractable, navigation optimisée
- **Tablette** : Interface adaptée aux écrans moyens
- **Desktop** : Interface complète avec sidebar fixe

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualise le build de production
npm run astro        # Commandes Astro CLI
```

## 🚀 Déploiement

### Build de Production

```bash
npm run build
```

### Déploiement sur Vercel

1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Déploiement sur Netlify

1. Connectez votre repository à Netlify
2. Configurez le build command : `npm run build`
3. Configurez le publish directory : `dist`

## 🔒 Sécurité

- **Authentification** : JWT tokens sécurisés
- **HTTPS** : Communication chiffrée avec l'API
- **Validation** : Validation côté client et serveur
- **CORS** : Configuration appropriée pour les requêtes cross-origin

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion API**
   - Vérifiez l'URL de l'API dans les variables d'environnement
   - Vérifiez que le backend est accessible

2. **Problèmes de build**
   - Vérifiez que toutes les dépendances sont installées
   - Vérifiez la version de Node.js

3. **Problèmes de style**
   - Vérifiez que Tailwind CSS est correctement configuré
   - Vérifiez les classes CSS dans les composants

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation de l'API backend
2. Vérifiez les logs de la console navigateur
3. Contactez l'équipe de développement

## 📄 Licence

Ce projet est propriétaire de SocialBoost Pro.

---

**SocialBoost Pro Admin** - Interface d'administration moderne et sécurisée 