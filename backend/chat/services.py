import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configurar la API de Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

class ChatService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
        self.chat = None

    def start_chat(self, user_context):
        """Inicia una nueva conversación con contexto del usuario."""
        child_name = user_context.get('child_name', 'el niño')
        child_age = user_context.get('child_age', '')
        
        context = f"""Eres Happy Bendis, un asistente virtual especializado en desarrollo infantil.
        Estás hablando con un padre/madre sobre {child_name} que tiene {child_age}.
        
        Tus respuestas deben ser:
        1. En español
        2. Amigables y empáticas
        3. Específicas para la edad del niño
        4. Incluir emojis para hacer la conversación más agradable
        5. Enfocadas en el desarrollo infantil y actividades educativas
        
        Si no tienes información sobre la edad, pregunta amablemente."""

        self.chat = self.model.start_chat(history=[])
        self.chat.send_message(context, stream=False)
        return "¡Hola! 👋 Soy Happy Bendis, tu asistente en el desarrollo infantil. ¿En qué puedo ayudarte hoy? 🌟"

    async def send_message(self, message):
        """Envía un mensaje al chat y obtiene la respuesta."""
        try:
            if not self.chat:
                self.chat = self.model.start_chat(history=[])
            
            response = await self.chat.send_message(message, stream=False)
            return response.text
        except Exception as e:
            print(f"Error al procesar mensaje: {e}")
            return "Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo? 🙏"

    def get_activity_suggestion(self, age_months):
        """Genera una sugerencia de actividad basada en la edad del niño."""
        prompt = f"""Sugiere una actividad educativa y divertida para un niño de {age_months} meses.
        
        La sugerencia debe incluir:
        1. Nombre de la actividad 🎯
        2. Beneficios para el desarrollo 🌱
        3. Materiales necesarios (comunes en casa) 🏠
        4. Pasos a seguir 📝
        5. Tiempo estimado ⏰
        6. Consejos de seguridad ⚠️
        
        Usa emojis y mantén un tono amigable y entusiasta."""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error al generar sugerencia de actividad: {e}")
            return "Lo siento, no pude generar una sugerencia en este momento. ¿Podrías intentarlo más tarde? 🙏"
