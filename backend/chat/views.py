from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import ChatService

# Create your views here.

class ChatView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chat_service = ChatService()

    async def post(self, request):
        """Maneja los mensajes del chat."""
        try:
            # Obtener datos del request
            message = request.data.get('message')
            user_context = request.data.get('context', {})
            
            if not message:
                return Response(
                    {'error': 'No se proporcionó mensaje'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Iniciar chat si es necesario
            if not self.chat_service.chat:
                initial_message = self.chat_service.start_chat(user_context)
                return Response({'response': initial_message})

            # Procesar el mensaje
            response = await self.chat_service.send_message(message)
            return Response({'response': response})

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
