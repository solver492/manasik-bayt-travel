# Voyage Revolution - Manasik Bayt Travel

Application web moderne pour la gestion de voyages spirituels (Omra, Hajj) et touristiques avec système de gamification.

## 🌟 Fonctionnalités

- **Authentification sécurisée** : Système de login/register avec sessions
- **Gestion des offres** : Manasik (Omra, Hajj), voyages touristiques, voyages organisés
- **Système de réservation** : Réservation en ligne avec suivi
- **Gamification** : Points et niveaux (Bronze, Silver, Gold, Platinum)
- **Multi-langues** : Support FR, AR, EN
- **Interface moderne** : Design élégant avec Tailwind CSS et Framer Motion

## 🛠️ Technologies

### Backend
- **Node.js** avec Express
- **TypeScript**
- **Drizzle ORM** pour la base de données
- **PostgreSQL** (production) / MemoryStore (développement)
- **Passport.js** pour l'authentification

### Frontend
- **React 18**
- **Vite** pour le build
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Wouter** pour le routing
- **TanStack Query** pour la gestion d'état

## 📦 Installation

1. Cloner le repository :
```bash
git clone https://github.com/VOTRE_USERNAME/voyage-revolution.git
cd voyage-revolution
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
# Créer un fichier .env à la racine
DATABASE_URL=postgresql://username:password@localhost:5432/voyage_revolution
NODE_ENV=development
PORT=5000
SESSION_SECRET=votre-secret-session
```

4. Lancer l'application en développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5000`

## 🚀 Déploiement

### Build pour production

```bash
npm run build
```

### Démarrer en production

```bash
npm start
```

### Déploiement sur cPanel/Hostinger

1. Builder l'application : `npm run build`
2. Uploader le dossier `dist/` sur votre serveur
3. Configurer les variables d'environnement sur le serveur
4. Créer un fichier `.htaccess` pour le routing

## 📁 Structure du projet

```
voyage-revolution/
├── client/              # Application React frontend
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilitaires
│   └── index.html
├── server/              # Backend Express
│   ├── auth.ts          # Authentification
│   ├── routes.ts        # Routes API
│   ├── storage.ts       # Gestion des données
│   └── index.ts         # Point d'entrée
├── shared/              # Code partagé
│   ├── schema.ts        # Schémas de base de données
│   └── routes.ts        # Définitions des routes
└── package.json
```

## 🔐 Sécurité

- Sessions sécurisées avec cookies HTTP-only
- Validation des données avec Zod
- Protection CSRF
- Mots de passe hashés (à implémenter avec bcrypt en production)

## 📝 TODO

- [ ] Implémenter le hashing des mots de passe avec bcrypt
- [ ] Ajouter la validation email
- [ ] Implémenter la réinitialisation de mot de passe
- [ ] Ajouter les paiements en ligne
- [ ] Système de notifications
- [ ] Panel admin complet

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

## 📄 Licence

MIT

## 📞 Contact

Pour toute question, contactez-nous à : contact@manasikbayt.com
