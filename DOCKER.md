# 🐳 Déploiement Docker - SocialBoost Pro Admin

Ce guide explique comment déployer l'application SocialBoost Pro Admin avec Docker.

## 📋 Prérequis

- Docker (version 20.10 ou supérieure)
- Docker Compose (version 2.0 ou supérieure)
- Au moins 2GB de RAM disponible
- 5GB d'espace disque libre

## 🚀 Déploiement Rapide

### 1. Déploiement en Développement

```bash
# Cloner le projet (si pas déjà fait)
git clone <repository-url>
cd sbp_admin

# Démarrer en mode développement
docker-compose -f docker-compose.dev.yml up -d

# Accéder à l'application
open http://localhost:3000
```

### 2. Déploiement en Production

```bash
# Utiliser le script de déploiement
chmod +x scripts/deploy.sh
./scripts/deploy.sh prod

# Ou manuellement
docker-compose up -d --build
```

## 📁 Structure des Fichiers Docker

```
├── Dockerfile                 # Configuration de l'image Docker
├── docker-compose.yml         # Configuration production
├── docker-compose.dev.yml     # Configuration développement
├── nginx.conf                 # Configuration Nginx (production)
├── .dockerignore              # Fichiers ignorés par Docker
├── scripts/
│   ├── deploy.sh              # Script de déploiement
│   └── backup.sh              # Script de sauvegarde
└── ssl/                       # Certificats SSL (production)
    ├── cert.pem
    └── key.pem
```

## 🔧 Configuration

### Variables d'Environnement

Vous pouvez personnaliser la configuration en créant un fichier `.env` :

```env
# Configuration de l'application
NODE_ENV=production
HOST=0.0.0.0
PORT=3000

# URL de l'API backend
PUBLIC_API_URL=https://sbpapi-production.up.railway.app

# Configuration Nginx (optionnel)
NGINX_PORT=80
NGINX_SSL_PORT=443
```

### Ports

- **Développement** : `http://localhost:3000`
- **Production** : `https://localhost` (avec Nginx)

## 🛠️ Commandes Utiles

### Développement

```bash
# Démarrer en mode développement
docker-compose -f docker-compose.dev.yml up -d

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f

# Arrêter
docker-compose -f docker-compose.dev.yml down

# Reconstruire
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production

```bash
# Démarrer en production
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Reconstruire
docker-compose up -d --build

# Vérifier la santé
docker-compose ps
```

### Maintenance

```bash
# Sauvegarder les données
./scripts/backup.sh

# Nettoyer les images non utilisées
docker image prune -f

# Nettoyer les volumes non utilisés
docker volume prune -f

# Nettoyer tout (attention!)
docker system prune -a
```

## 🔒 Sécurité

### Certificats SSL

Pour la production, vous devez configurer des certificats SSL valides :

1. **Certificats Let's Encrypt** (recommandé)
   ```bash
   # Installer certbot
   sudo apt install certbot

   # Obtenir un certificat
   sudo certbot certonly --standalone -d votre-domaine.com

   # Copier les certificats
   sudo cp /etc/letsencrypt/live/votre-domaine.com/fullchain.pem ./ssl/cert.pem
   sudo cp /etc/letsencrypt/live/votre-domaine.com/privkey.pem ./ssl/key.pem
   ```

2. **Certificats auto-signés** (développement uniquement)
   ```bash
   # Le script de déploiement les crée automatiquement
   ./scripts/deploy.sh prod
   ```

### Headers de Sécurité

Nginx est configuré avec les headers de sécurité suivants :
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📊 Monitoring

### Health Check

L'application expose un endpoint de santé :
```bash
curl http://localhost:3000/health
# Réponse: "healthy"
```

### Logs

```bash
# Logs de l'application
docker-compose logs sbp-admin

# Logs de Nginx (production)
docker-compose logs nginx

# Logs en temps réel
docker-compose logs -f
```

### Métriques

```bash
# Utilisation des ressources
docker stats

# Espace disque
docker system df
```

## 🔄 Mise à Jour

### Mise à Jour de l'Application

```bash
# 1. Arrêter l'application
docker-compose down

# 2. Récupérer les dernières modifications
git pull

# 3. Reconstruire et redémarrer
docker-compose up -d --build

# 4. Vérifier la santé
curl http://localhost:3000/health
```

### Mise à Jour de Docker

```bash
# Sauvegarder avant mise à jour
./scripts/backup.sh

# Mettre à jour Docker
sudo apt update && sudo apt upgrade docker-ce docker-ce-cli containerd.io

# Redémarrer l'application
docker-compose up -d --build
```

## 🚨 Dépannage

### Problèmes Courants

1. **Port déjà utilisé**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :3000
   
   # Changer le port dans docker-compose.yml
   ports:
     - "3001:3000"  # Utiliser le port 3001
   ```

2. **Erreur de permissions**
   ```bash
   # Corriger les permissions
   sudo chown -R $USER:$USER .
   chmod +x scripts/*.sh
   ```

3. **Image ne se construit pas**
   ```bash
   # Nettoyer le cache Docker
   docker builder prune -f
   
   # Reconstruire sans cache
   docker-compose build --no-cache
   ```

4. **Application ne démarre pas**
   ```bash
   # Vérifier les logs
   docker-compose logs sbp-admin
   
   # Vérifier la configuration
   docker-compose config
   ```

### Logs Détaillés

```bash
# Logs avec timestamps
docker-compose logs -t

# Logs des 100 dernières lignes
docker-compose logs --tail=100

# Logs d'un service spécifique
docker-compose logs sbp-admin
```

## 📈 Performance

### Optimisations Recommandées

1. **Limiter les ressources**
   ```yaml
   # Dans docker-compose.yml
   services:
     sbp-admin:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '0.5'
   ```

2. **Utiliser un volume pour les logs**
   ```yaml
   volumes:
     - ./logs:/app/logs
   ```

3. **Configurer la compression Nginx**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

## 🔧 Personnalisation Avancée

### Configuration Nginx Personnalisée

Vous pouvez modifier `nginx.conf` pour ajouter :
- Rate limiting personnalisé
- Headers de sécurité supplémentaires
- Redirection personnalisée
- Cache proxy

### Variables d'Environnement Avancées

```env
# Configuration de l'API
PUBLIC_API_URL=https://sbpapi-production.up.railway.app
API_TIMEOUT=30000

# Configuration de l'application
APP_NAME="SocialBoost Pro Admin"
APP_VERSION=1.0.0

# Configuration de sécurité
SESSION_SECRET=votre-secret-tres-securise
COOKIE_SECURE=true
```

## 📞 Support

Pour toute question ou problème :

1. Vérifiez les logs : `docker-compose logs`
2. Consultez la documentation Astro
3. Vérifiez la configuration Docker
4. Contactez l'équipe de développement

---

**SocialBoost Pro Admin** - Déploiement Docker sécurisé et optimisé 