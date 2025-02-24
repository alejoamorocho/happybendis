# Guía de Despliegue - Happy Bendis

## Requisitos Previos
- Docker y Docker Compose instalados
- Clave de API de Google Gemini
- Node.js y npm (para desarrollo local)
- Python 3.11 (para desarrollo local)

## Pasos para el Despliegue

### 1. Configuración de Variables de Entorno
1. En la carpeta `backend/`, crear archivo `.env`:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   DEBUG=0
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   ```

### 2. Construcción y Despliegue con Docker
1. Desde la raíz del proyecto, ejecutar:
   ```bash
   docker-compose up --build
   ```

2. La aplicación estará disponible en:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### 3. Verificación del Despliegue
1. Acceder al frontend y verificar la conexión con el chat
2. Verificar que el backend responde correctamente
3. Comprobar la integración con Gemini API

## Solución de Problemas
- Si el frontend no carga, verificar los logs: `docker-compose logs frontend`
- Si el backend no responde, verificar los logs: `docker-compose logs backend`
- Para reiniciar los servicios: `docker-compose restart`
