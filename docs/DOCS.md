# Happy Bendis - Documentación Técnica 📚

## Arquitectura del Sistema

### Frontend (Firebase Hosting)
- **URL**: [https://happybendis.web.app](https://happybendis.web.app)
- **Tecnologías**:
  - React 18 con TypeScript
  - Vite para build y desarrollo
  - Chakra UI para componentes
  - Firebase SDK para autenticación y base de datos
- **Características**:
  - Autenticación de usuarios
  - Almacenamiento de perfiles en Firestore
  - Chat interactivo con IA
  - Diseño responsive

### Backend (Google Cloud Run)
- **URL**: [https://happybendis-backend-11372342968.us-central1.run.app](https://happybendis-backend-11372342968.us-central1.run.app)
- **Tecnologías**:
  - Django REST Framework
  - Gemini API para generación de texto
  - Firebase Admin SDK
  - Docker para containerización
- **Características**:
  - API RESTful
  - Integración con Gemini API
  - Autenticación con Firebase
  - Escalado automático

## Flujo de Datos

1. **Autenticación**:
   - Usuario se registra/inicia sesión a través de Firebase Auth
   - Frontend almacena token JWT
   - Backend verifica token usando Firebase Admin SDK

2. **Chat**:
   - Frontend envía mensajes al backend
   - Backend procesa con Gemini API
   - Respuesta se envía de vuelta al frontend
   - Conversación se almacena en Firestore

## Despliegue

### Frontend (Firebase Hosting)
```bash
# Construir la aplicación
npm run build

# Desplegar en Firebase
firebase deploy --only hosting
```

### Backend (Cloud Run)
```bash
# Construir imagen Docker
docker build -t happybendis-backend .

# Desplegar en Cloud Run
gcloud run deploy happybendis-backend \
  --image gcr.io/happybendis/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Variables de Entorno

### Frontend
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_URL=https://happybendis-backend-11372342968.us-central1.run.app
```

### Backend
```env
GEMINI_API_KEY=
FIREBASE_ADMIN_SDK_PATH=firebase-admin-sdk.json
```

## Seguridad

- Autenticación manejada por Firebase
- Variables sensibles en .env (no versionadas)
- CORS configurado para dominios específicos
- Firestore rules implementadas
- Backend en contenedor Docker

## Monitoreo

- Firebase Analytics para frontend
- Cloud Run metrics para backend
- Logs disponibles en Google Cloud Console

## Desarrollo Local

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### Docker Compose
```bash
docker-compose up
```

## Pruebas

### Frontend
```bash
npm run test
```

### Backend
```bash
python manage.py test
```

## Recursos Adicionales

- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
