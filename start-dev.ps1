# Script PowerShell pour démarrer l'application en mode développement
# 
# IMPORTANT: Cette application nécessite une base de données PostgreSQL
# Vous devez définir la variable DATABASE_URL avant de démarrer
#
# Exemple:
# $env:DATABASE_URL = "postgresql://username:password@localhost:5432/database_name"

# Configuration des variables d'environnement
$env:NODE_ENV = "development"
$env:PORT = "5000"

# DÉCOMMENTEZ et MODIFIEZ la ligne suivante avec vos informations de base de données:
# $env:DATABASE_URL = "postgresql://username:password@localhost:5432/voyage_revolution"

# Vérification de la variable DATABASE_URL
# DATABASE_URL check removed as app uses MemStorage

Write-Host "Démarrage de l'application en mode développement..." -ForegroundColor Green
Write-Host "URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

npx tsx server/index.ts
