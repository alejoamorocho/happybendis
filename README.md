# Happy Bendis - Tu Asistente Virtual en el Desarrollo Infantil 👶

Happy Bendis es una aplicación web diseñada especialmente para padres con niños entre 6 meses y 5 años. Utilizando inteligencia artificial, Happy Bendis se convierte en tu compañero personalizado en el hermoso viaje de la crianza.

## ¿Qué hace Happy Bendis? 🌟

- **Chat Inteligente Personalizado**: Conversa con un asistente que conoce a tu hijo por nombre y edad, brindando respuestas adaptadas a su etapa de desarrollo.
- **Actividades Personalizadas**: Recibe sugerencias de actividades específicas para la edad de tu pequeño, con explicaciones claras sobre los beneficios para su desarrollo.
- **Seguimiento del Desarrollo**: Comprende mejor las etapas de crecimiento de tu hijo y recibe recomendaciones apropiadas para cada momento.

## ¿Por qué Happy Bendis? 💡

- **Personalizado**: No más búsquedas genéricas en internet. Happy Bendis conoce a tu hijo y adapta sus respuestas.
- **En Español**: Diseñado específicamente para la comunidad hispanohablante.
- **Fácil de Usar**: Interfaz intuitiva que hace que obtener ayuda sea tan simple como chatear con un amigo.

## Arquitectura 🏗️

### Frontend (React + Vite)
- Autenticación mediante Firebase Auth
- Almacenamiento de datos en Firebase Firestore
- UI moderna y responsiva con Tailwind CSS
- Despliegue en Firebase Hosting

### Backend (Django)
- Integración con Gemini API para respuestas inteligentes
- Endpoints REST para el chat
- No maneja autenticación ni almacenamiento (lo hace el frontend)

## Configuración del Proyecto 🔧

### Frontend
1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno en `.env.local`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

### Backend
1. Instalar dependencias:
```bash
cd backend
pip install -r requirements.txt
```

2. Configurar variables de entorno en `.env`:
```
GEMINI_API_KEY=...
```

3. Iniciar servidor:
```bash
python manage.py runserver
```

## 🐳 Despliegue con Docker

Para ejecutar Happy Bendis usando Docker, sigue estos pasos:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias:
   ```env
   GEMINI_API_KEY=tu_api_key_de_gemini
   ```

3. Construye y ejecuta los contenedores:
   ```bash
   docker-compose up --build
   ```

4. Accede a la aplicación:
   - Frontend: http://localhost
   - Backend: http://localhost:8000

### Comandos útiles de Docker

- Detener los contenedores:
  ```bash
  docker-compose down
  ```

- Ver logs de los contenedores:
  ```bash
  docker-compose logs -f
  ```

- Reiniciar un servicio específico:
  ```bash
  docker-compose restart backend  # o frontend
  ```

## 🌐 Demo en Vivo

Prueba Happy Bendis aquí: [https://happybendis.web.app](https://happybendis.web.app)

## 🏗️ Arquitectura Actualizada

La aplicación utiliza una arquitectura moderna dividida en dos partes principales:

### Frontend (Firebase Hosting)
- React + Vite
- Chakra UI para la interfaz
- Firebase Authentication
- Firebase Firestore
- Desplegado en Firebase Hosting

### Backend (Cloud Run)
- Python Django
- Gemini API para IA
- Firebase Admin SDK
- Desplegado en Google Cloud Run

## 🚀 URLs de Producción

- **Frontend**: [https://happybendis.web.app](https://happybendis.web.app)
- **Backend API**: [https://happybendis-backend-11372342968.us-central1.run.app](https://happybendis-backend-11372342968.us-central1.run.app)

## 💻 Desarrollo Local

### Requisitos Previos
- Node.js 18 o superior
- Python 3.11 o superior
- Docker (para desarrollo del backend)

### Configuración del Frontend

```bash
cd frontend
npm install
# Crea un archivo .env.local con las variables necesarias
npm run dev
```

### Configuración del Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
# Crea un archivo .env con las variables necesarias
python manage.py runserver
```

## 🔐 Variables de Entorno

### Frontend (.env.local)
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
VITE_API_URL=https://happybendis-backend-11372342968.us-central1.run.app
```

### Backend (.env)
```
GEMINI_API_KEY=tu_gemini_api_key
FIREBASE_ADMIN_SDK_PATH=firebase-admin-sdk.json
```

## 🔄 CI/CD

El proyecto utiliza un flujo de despliegue automatizado:
- Frontend: Firebase Hosting
- Backend: Google Cloud Run con contenedores Docker

## 👥 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Creado por 👨‍💻
Alejandro Amorocho
