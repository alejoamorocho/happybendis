import os
import logging
import traceback
import google.generativeai as genai
from dotenv import load_dotenv

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configurar la API de Gemini
api_key = os.getenv('GEMINI_API_KEY')
logger.debug(f"API Key encontrada: {'Sí' if api_key else 'No'}")

if not api_key:
    logger.error("No se encontró GEMINI_API_KEY en las variables de entorno")
    raise ValueError("GEMINI_API_KEY no encontrada")

try:
    genai.configure(api_key=api_key)
    logger.debug("Gemini API configurada correctamente")
except Exception as e:
    logger.error(f"Error al configurar Gemini API: {str(e)}")
    raise

class ChatService:
    def __init__(self):
        try:
            logger.debug("Inicializando ChatService...")
            self.model = genai.GenerativeModel('gemini-pro')
            self.chat = None
            self.context = None
            logger.info("ChatService inicializado correctamente")
        except Exception as e:
            logger.error(f"Error al inicializar ChatService: {str(e)}\n{traceback.format_exc()}")
            raise

    def _create_initial_context(self, user_name, child_name, child_age, child_gender):
        """Crea el contexto inicial para el chat."""
        return f"""Eres Happy Bendis, un asistente virtual especializado en desarrollo infantil y educación temprana. 
        Estás hablando con {user_name} sobre {child_name}, que es {child_gender} y tiene {child_age}.

        INSTRUCCIONES IMPORTANTES:

        1. PERSONALIZACIÓN:
        - Siempre refiere al {child_gender} como "{child_name}"
        - Adapta todas las recomendaciones y actividades específicamente para {child_age}
        - Usa el nombre "{user_name}" cuando te dirijas a la persona
        - Nunca asumas que es padre o madre, simplemente usa su nombre
        - Adapta tus respuestas al género de {child_name} ({child_gender})

        2. ESTILO DE COMUNICACIÓN:
        - Habla en español de manera amigable y cercana
        - Usa "tú" en lugar de "usted"
        - Incluye emojis para hacer la conversación más agradable y expresiva
        - Mantén un tono positivo y alentador
        - Sé empático y comprensivo

        3. ACTIVIDADES Y RECOMENDACIONES:
        - Para cada actividad sugerida, especifica:
          • **Edad recomendada:**
          • **Duración aproximada:**
          • **Materiales necesarios:**
          • **Beneficios para el desarrollo:**
          • **Pasos a seguir:**
        - Asegúrate de que las actividades sean:
          • **Seguras para la edad**
          • **Realizables en casa**
          • **Divertidas y educativas**
          • **Adaptadas al nivel de desarrollo**
          • **Apropiadas para {child_gender}**

        4. SEGURIDAD Y BIENESTAR:
        - Prioriza siempre la seguridad del {child_gender}
        - Si detectas alguna preocupación seria, sugiere consultar con un profesional
        - Promueve hábitos saludables y desarrollo integral

        5. FORMATO DE RESPUESTAS:
        - Mantén las respuestas concisas pero informativas
        - Usa emojis relevantes para hacer la comunicación más amena
        - Estructura las respuestas de manera clara y fácil de leer
        - Si das pasos o instrucciones, enuméralos
        - Usa **negritas** para resaltar información importante
        - Cuando sugieras actividades, usa el formato:
          
          🎯 **Nombre de la actividad**
          
          👶 **Edad recomendada:** {child_age}
          ⏱️ **Duración:** [duración]
          🏠 **Materiales:** [lista de materiales]
          🌱 **Beneficios:** [beneficios]
          
          📝 **Pasos:**
          1. [paso 1]
          2. [paso 2]
          ...
          
          ⚠️ **Consejos de seguridad:**
          - [consejo 1]
          - [consejo 2]

        Recuerda: Eres un amigo que quiere lo mejor para {child_name} y su familia. 
        Tu objetivo es ayudar a {user_name} a apoyar el desarrollo de {child_name} de la mejor manera posible, 
        siempre con un enfoque positivo y constructivo. 🌟"""

    def start_chat(self, user_context):
        """Inicia una nueva conversación con contexto del usuario."""
        try:
            logger.info(f"Iniciando chat con contexto: {user_context}")
            
            # Extraer información del contexto
            user_name = user_context.get('user_name', 'amigo/a')
            child_name = user_context.get('child_name', 'pequeño/a')
            child_age = user_context.get('child_age', '')
            child_gender = user_context.get('child_gender', 'niño/a')
            
            # Crear contexto inicial
            self.context = self._create_initial_context(user_name, child_name, child_age, child_gender)
            
            # Iniciar chat con el contexto
            self.chat = self.model.start_chat(history=[])
            self.chat.send_message(self.context)
            
            logger.info("Chat iniciado exitosamente")
            return f"¡Hola {user_name}! 👋 Soy Happy Bendis, tu asistente en el desarrollo de {child_name}. Estoy aquí para ayudarte con cualquier pregunta o inquietud que tengas. ¿En qué puedo ayudarte hoy? 🌟"
            
        except Exception as e:
            logger.error(f"Error al iniciar chat: {str(e)}\n{traceback.format_exc()}")
            raise

    def send_message(self, message, user_context=None):
        """Envía un mensaje al chat y obtiene la respuesta."""
        try:
            logger.info(f"Enviando mensaje: {message}")
            
            # Si hay nuevo contexto o no hay chat activo, iniciar uno nuevo
            if not self.chat:
                response = self.start_chat(user_context or {})
                # Si es el primer mensaje, procesar también este mensaje
                if message:
                    return self.send_message(message)
                return response
            
            # Enviar mensaje y obtener respuesta
            try:
                logger.debug("Enviando mensaje a Gemini...")
                response = self.chat.send_message(message)
                logger.debug(f"Respuesta recibida de Gemini: {response}")
                return response.text
            except Exception as e:
                logger.error(f"Error al enviar mensaje a Gemini: {str(e)}\n{traceback.format_exc()}")
                return "Lo siento, hubo un error al comunicarse con el asistente. ¿Podrías intentarlo de nuevo? 🙏"
            
        except Exception as e:
            logger.error(f"Error al procesar mensaje: {str(e)}\n{traceback.format_exc()}")
            return "Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo? 🙏"
