/// <reference types="vite/client" />

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

interface ChatContext {
  child_name: string;
  child_age: string;
  child_gender: 'niño' | 'niña';
  user_name: string;
}

interface ChatResponse {
  response: string;
}

export const sendMessageToGemini = async (
  message: string, 
  childName: string, 
  childAge: string,
  childGender: 'niño' | 'niña',
  userName: string = 'amigo/a'
): Promise<string> => {
  try {
    console.log('Enviando mensaje:', { message, childName, childAge, childGender, userName });
    
    const response = await fetch(`${BACKEND_URL}/api/chat/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: {
          child_name: childName,
          child_age: childAge,
          child_gender: childGender,
          user_name: userName
        } as ChatContext
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
      throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
    }

    const data = await response.json() as ChatResponse;
    console.log('Respuesta recibida:', data);
    
    if (!data.response) {
      throw new Error('Respuesta inválida del servidor');
    }

    return data.response;
  } catch (error) {
    console.error('Error al enviar mensaje a Gemini:', error);
    throw error;
  }
};
