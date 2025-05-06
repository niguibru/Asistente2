import React, { useState } from 'react';

interface Message {
  text: string;
  sender: string;
}

export default function ChatAgent() {
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
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center">
            <img
              src="/images/chat/AvatarChatAgent.jpeg" // Asegúrate de que este content_id sigue siendo válido o reemplázalo
              alt="Avatar del agente virtual"
              className="w-36 h-36 rounded-full mr-4"
            />
            <p className="text-lg font-semibold">¿Cómo puedo ayudarte hoy?</p>
          </div>
        </div>
        {/* <div className="relative ">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You earn $3287 today, it's higher than last month. Keep up your good
          work!
        </p> */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                  }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 mr-2 bg-gray-100"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={(event) => { // Opcional: enviar con la tecla Enter
                if (event.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-700"
              onClick={handleSendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
