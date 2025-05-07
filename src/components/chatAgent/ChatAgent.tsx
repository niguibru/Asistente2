import { useEffect } from 'react';
import '@n8n/chat/style.css';
import './chatAgent.css'
import { createChat } from '@n8n/chat';

export default function ChatAgent() {

  useEffect(() => {
		createChat({
			webhookUrl: 'https://zinco.app.n8n.cloud/webhook/01de331e-b178-4aa3-82e7-b64fae4d247e/chat',
      mode: 'fullscreen', 
      target: '#n8n-chat5',
      initialMessages: [
        `Estoy aquí para ayudarte con dudas contables, fiscales o laborales.\n\n Ejemplos de preguntas que puedes hacerme:\n\n • ¿Cómo se contabiliza una subvención?\n\n • ¿Qué retención aplico en una factura a un autónomo?\n\n • ¿Qué modelo debo presentar para declarar el IVA?\n\n • ¿Cómo calculo el finiquito de un trabajador?\n\n • ¿Dónde encuentro el modelo 111 en la AEAT?`
      ],
		});
	}, []);


  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] h-[700px] flex flex-col">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6 flex flex-col h-full">
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center">
            <img
              src="/images/chat/AvatarChatAgent.jpeg"
              alt="Avatar del agente virtual"
              className="w-36 h-36 rounded-full mr-4"
            />
            <p className="text-2xl font-semibold">
              Hola, soy Zinco Co-Pilot. <br />
              ¿Cómo puedo ayudarte hoy?
            </p>
          </div>
        </div>

        <div className="p-4 h-full w-full flex-1 overflow-hidden" id="n8n-chat5">
          {/* Chat embed acá */}
        </div>
      </div>
    </div>
  );
  
}
