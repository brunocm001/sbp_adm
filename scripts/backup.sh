#!/bin/bash

# Script de sauvegarde pour SocialBoost Pro Admin
# Usage: ./scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="sbp_admin_backup_$DATE"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Créer le répertoire de sauvegarde
mkdir -p "$BACKUP_DIR"

log "Démarrage de la sauvegarde..."

# Sauvegarder les logs
if [ -d "./logs" ]; then
    log "Sauvegarde des logs..."
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_logs.tar.gz" -C . logs/
fi

# Sauvegarder les certificats SSL
if [ -d "./ssl" ]; then
    log "Sauvegarde des certificats SSL..."
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_ssl.tar.gz" -C . ssl/
fi

# Sauvegarder la configuration Docker
log "Sauvegarde de la configuration Docker..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" \
    docker-compose.yml \
    docker-compose.dev.yml \
    Dockerfile \
    nginx.conf \
    .dockerignore

# Créer un fichier de métadonnées
cat > "$BACKUP_DIR/${BACKUP_NAME}_metadata.txt" << EOF
Sauvegarde SocialBoost Pro Admin
Date: $(date)
Version: $(git describe --tags 2>/dev/null || echo "unknown")
Docker Images:
$(docker images | grep sbp-admin || echo "Aucune image trouvée")
EOF

# Nettoyer les anciennes sauvegardes (garder les 10 plus récentes)
log "Nettoyage des anciennes sauvegardes..."
cd "$BACKUP_DIR"
ls -t | tail -n +11 | xargs -r rm -rf
cd ..

# Afficher le résumé
log "Sauvegarde terminée!"
echo "Fichiers créés dans $BACKUP_DIR:"
ls -la "$BACKUP_DIR/${BACKUP_NAME}"*

# Calculer la taille totale
TOTAL_SIZE=$(du -sh "$BACKUP_DIR/${BACKUP_NAME}"* | awk '{sum+=$1} END {print sum}')
log "Taille totale de la sauvegarde: $TOTAL_SIZE" 