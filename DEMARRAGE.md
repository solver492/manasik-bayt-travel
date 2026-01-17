# Guide de démarrage de l'application Voyage Revolution

## Prérequis

Cette application nécessite:
1. **Node.js** (version 20 ou supérieure)
2. **PostgreSQL** (version 16 recommandée)

## Configuration de la base de données

### Option 1: Installation locale de PostgreSQL

1. Téléchargez et installez PostgreSQL depuis: https://www.postgresql.org/download/windows/

2. Créez une nouvelle base de données:
   ```sql
   CREATE DATABASE voyage_revolution;
   ```

3. Notez vos informations de connexion:
   - Nom d'utilisateur (par défaut: `postgres`)
   - Mot de passe (défini lors de l'installation)
   - Port (par défaut: `5432`)
   - Nom de la base de données: `voyage_revolution`

### Option 2: Utiliser une base de données cloud (Supabase, Neon, etc.)

1. Créez un compte sur [Supabase](https://supabase.com/) ou [Neon](https://neon.tech/)
2. Créez un nouveau projet
3. Copiez l'URL de connexion PostgreSQL fournie

## Démarrage de l'application

### Méthode 1: Utiliser le script PowerShell (Recommandé)

1. Ouvrez PowerShell dans le dossier du projet

2. Définissez la variable DATABASE_URL:
   ```powershell
   $env:DATABASE_URL = "postgresql://username:password@localhost:5432/voyage_revolution"
   ```
   
   Remplacez:
   - `username` par votre nom d'utilisateur PostgreSQL
   - `password` par votre mot de passe
   - `localhost` par l'adresse de votre serveur (si distant)
   - `5432` par le port (si différent)
   - `voyage_revolution` par le nom de votre base de données

3. Exécutez le script:
   ```powershell
   .\start-dev.ps1
   ```

### Méthode 2: Configuration manuelle

1. Créez un fichier `.env` à la racine du projet:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/voyage_revolution
   NODE_ENV=development
   PORT=5000
   ```

2. Installez les dépendances (si ce n'est pas déjà fait):
   ```powershell
   npm install
   ```

3. Exécutez les migrations de base de données:
   ```powershell
   npm run db:push
   ```

4. Démarrez l'application:
   ```powershell
   $env:DATABASE_URL = "postgresql://username:password@localhost:5432/voyage_revolution"
   npx tsx server/index.ts
   ```

## Accès à l'application

Une fois démarrée, l'application sera accessible à:
- **URL locale**: http://localhost:5000

## Dépannage

### Erreur "DATABASE_URL must be set"
- Assurez-vous que la variable d'environnement DATABASE_URL est correctement définie
- Vérifiez que la chaîne de connexion est correcte

### Erreur de connexion à PostgreSQL
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les informations de connexion (nom d'utilisateur, mot de passe, port)
- Assurez-vous que la base de données existe

### Port 5000 déjà utilisé
- Changez le port en définissant: `$env:PORT = "3000"` (ou un autre port disponible)

## Commandes utiles

- **Démarrage en développement**: `npm run dev` (nécessite configuration Windows)
- **Build pour production**: `npm run build`
- **Démarrage en production**: `npm start`
- **Vérification TypeScript**: `npm run check`
- **Migration base de données**: `npm run db:push`
