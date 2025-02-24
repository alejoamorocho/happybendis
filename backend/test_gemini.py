import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key encontrada: {'Sí' if api_key else 'No'}")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Di hola en español")
    print("Respuesta de Gemini:", response.text)
except Exception as e:
    print("Error:", str(e))
