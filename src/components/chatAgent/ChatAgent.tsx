import React, { useState } from 'react';
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import './chatAgent.css'
import { createChat } from '@n8n/chat';

interface Message {
  text: string;
  sender: string;
}

export default function ChatAgent() {

  useEffect(() => {
		createChat({
			webhookUrl: 'https://zinco.app.n8n.cloud/webhook/01de331e-b178-4aa3-82e7-b64fae4d247e/chat',
      mode: 'fullscreen', 
      target: '#n8n-chat5',
      initialMessages: [
        'Soy Zinco Copilot, pregunta lo que quieras.'
        //agregar ejemplos
      ],
		});
	}, []);

	//return (<div></div>);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      // Ahora TypeScript sabe que el nuevo objeto es compatible con el tipo Message[]
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Aquí iría la lógica para enviar el mensaje al agente virtual
      // y recibir su respuesta, que luego se añadiría al estado 'messages'
      // Por ejemplo, si recibes una respuesta:
      // setMessages(prevMessages => [...prevMessages, { text: "Respuesta del agente", sender: "agent" }]);
    }
  };



  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] h-full">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6 h-full">
        <div className="p-4 flex-shrink-0 ">
          <div className="flex items-center">
            <img
              src="/images/chat/AvatarChatAgent.jpeg" // Asegúrate de que este content_id sigue siendo válido o reemplázalo
              alt="Avatar del agente virtual"
              className="w-36 h-36 rounded-full mr-4"
            />
            <p className="text-lg font-semibold">¿Cómo puedo ayudarte hoy?</p>
          </div>
        </div>
       
        
        
        <div className="p-4 h-full w-full" id="n8n-chat5">
                  
        </div>
       
      </div>


    </div>
  );
}
