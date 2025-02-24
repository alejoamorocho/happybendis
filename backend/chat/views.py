import logging
import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import ChatService

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create your views here.

class ChatView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            self.chat_service = ChatService()
            logger.info("ChatView inicializado correctamente")
        except Exception as e:
            logger.error(f"Error al inicializar ChatView: {str(e)}\n{traceback.format_exc()}")
            raise

    def post(self, request):
        """Maneja los mensajes del chat."""
        try:
            # Log del request completo
            logger.debug(f"Request data completo: {request.data}")
            
            # Obtener datos del request
            message = request.data.get('message')
            user_context = request.data.get('context', {})
            
            logger.info(f"Mensaje recibido: {message}")
            logger.info(f"Contexto recibido: {user_context}")
            
            if not message:
                logger.warning("Intento de enviar mensaje vacío")
                return Response(
                    {'error': 'No se proporcionó mensaje'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Procesar el mensaje y obtener respuesta
            response = self.chat_service.send_message(message, user_context)
            logger.debug(f"Respuesta del chat_service: {response}")
            
            if not response:
                logger.error("Respuesta vacía del servicio de chat")
                return Response(
                    {'error': 'No se pudo obtener una respuesta'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            logger.info("Mensaje procesado exitosamente")
            return Response({'response': response})

        except Exception as e:
            error_msg = f"Error en ChatView: {str(e)}\n{traceback.format_exc()}"
            logger.error(error_msg)
            return Response(
                {'error': 'Error al procesar el mensaje. Por favor, intenta de nuevo.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
