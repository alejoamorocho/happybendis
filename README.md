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

## Creado por 👨‍💻
Alejandro Amorocho
