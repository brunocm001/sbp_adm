#!/bin/bash

# Script de déploiement pour SocialBoost Pro Admin
# Usage: ./scripts/deploy.sh [dev|prod]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Vérifier les arguments
ENVIRONMENT=${1:-prod}

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    error "Usage: $0 [dev|prod]"
fi

log "Démarrage du déploiement en mode: $ENVIRONMENT"

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé"
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé"
fi

# Arrêter les conteneurs existants
log "Arrêt des conteneurs existants..."
if [[ "$ENVIRONMENT" == "prod" ]]; then
    docker-compose down --remove-orphans
else
    docker-compose -f docker-compose.dev.yml down --remove-orphans
fi

# Nettoyer les images non utilisées
log "Nettoyage des images Docker..."
docker image prune -f

# Construire et démarrer les conteneurs
log "Construction et démarrage des conteneurs..."
if [[ "$ENVIRONMENT" == "prod" ]]; then
    # Vérifier les certificats SSL pour la production
    if [[ ! -f "./ssl/cert.pem" || ! -f "./ssl/key.pem" ]]; then
        warn "Certificats SSL manquants. Création de certificats auto-signés..."
        mkdir -p ssl
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem -out ssl/cert.pem \
            -subj "/C=FR/ST=France/L=Paris/O=SocialBoost Pro/CN=localhost"
    fi
    
    docker-compose up -d --build
    log "Application déployée en production sur https://localhost"
else
    docker-compose -f docker-compose.dev.yml up -d --build
    log "Application déployée en développement sur http://localhost:3000"
fi

# Attendre que l'application soit prête
log "Attente du démarrage de l'application..."
sleep 10

# Vérifier la santé de l'application
log "Vérification de la santé de l'application..."
if curl -f http://localhost:3000/health &> /dev/null; then
    log "✅ Application démarrée avec succès!"
else
    warn "⚠️  L'application pourrait ne pas être encore prête"
fi

# Afficher les logs
log "Affichage des logs..."
if [[ "$ENVIRONMENT" == "prod" ]]; then
    docker-compose logs -f --tail=50
else
    docker-compose -f docker-compose.dev.yml logs -f --tail=50
fi 