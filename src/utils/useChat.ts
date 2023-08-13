import { useState, useEffect } from 'react';
import { ChatBody, OpenAIModel } from '@/types/types';
import { handleCommands } from '@/utils/commands';
import { createUserMessage, createBotMessage, getAllMessages, updateMessage } from './messages';
import { v4 as uuidv4 } from 'uuid';

export const useChat = (apiKeyApp: string, socket: typeof SocketIOClient.Socket | null) => {
    const [chatHistory, setChatHistory] = useState<Array<{ id: string; type: 'user' | 'bot'; message: string }>>([]);
    const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [outputCode, setOutputCode] = useState<string>('');
    const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const fetchChatHistory = async () => {
                try {
                    const messages = await getAllMessages();
                    console.log(messages)
                    if (Array.isArray(messages)) {
                        setChatHistory(messages);
                    } else {
                        setChatHistory([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch chat history from API:", error);
                    setChatHistory([]); // Default to empty array in case of error
                }
            };
    
        fetchChatHistory();
    }, []);
    

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    const clearChatHistory = async () => {
        try {
            const response = await fetch('/api/messages?truncate=true', {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Failed to truncate chat history.');
            }
            
            setChatHistory([]);
        } catch (error) {
            console.error("Error clearing chat history:", error);
            // Here, you can handle any additional error logging or UI feedback.
        }
    };

    useEffect(() => {
        if(socket) {
          console.log("SOCKET CONNECTED!", socket.id);
    
          // update chat on new message dispatched
          socket.on("messageCreated", (message: string) => {
              console.log("WS:createMessage:", message);
              const newMessage = { id:message.id, type:message.type, message:message.message };
              setChatHistory(prev => [...prev, newMessage]);
          });

          socket.on("messageUpdated", (message: string) => {
            console.log("WS:updateMessage:", message);
            stateUpdateMessageById(message.id, message.message)
           });
        }
    
        return () => {
            if(socket) {
                socket.off("messageCreated");
                socket.off("messageUpdated");
            }
        }
    }, [socket]);
    

    const updateMessageById = async (id: string, updatedMessage: string) => {
        await stateUpdateMessageById(id, updatedMessage); // Await this function
        await updateMessage(id, updatedMessage); // Await this function
    };
      
      const stateUpdateMessageById = (id: string, updatedMessage: string) => {
        setChatHistory(prev =>
          prev.map(message => (message.id === id ? { ...message, message: updatedMessage } : message))
        );
      };
      
    

    const addUserMessageToChatHistory = async (message: string) => {
        try {
            const savedMessage = await createUserMessage(message);
            return savedMessage.id;
        } catch (error) {
            console.error("Error adding user message:", error);
        }
    };
    
    const addBotMessageToChatHistory = async (message: string) => {
        try {
            const savedMessage = await createBotMessage(message);
            return savedMessage.id;
        } catch (error) {
            console.error("Error adding bot message:", error);
        }
    };
    

    const handleChat = async () => {
        setInputOnSubmit(inputCode);
        const apiKey = apiKeyApp;
        setInputOnSubmit(inputCode);

        const maxCodeLength = model === 'gpt-3.5-turbo' ? 60000 : 60000;

        if (!apiKeyApp?.includes('sk-') && !apiKey?.includes('sk-')) {
                alert('Please enter an API key.');
                return;
        }

        if (!inputCode) {
                alert('Please enter your message.');
                return;
        }

        if (inputCode.length > maxCodeLength) {
                alert(
                        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
                );
                return;
        }


        setLoading(true);
        await addUserMessageToChatHistory(inputCode); 

        if (inputCode.startsWith('/')) {
            handleCommands(inputCode, setLoading, addBotMessageToChatHistory, clearChatHistory, updateMessageById);
            setInputCode('');
            return; 
        }

        const controller = new AbortController();
        const body: ChatBody = {
                inputCode,
                model,
                apiKey,
        };

        const response = await fetch('/api/chatAPI', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                },
                signal: controller.signal,
                body: JSON.stringify(body),
        });

        if (!response.ok) {
                setLoading(false);
                alert(
                        'Something went wrong went fetching from the API. Make sure to use a valid API key.',
                );
                return;
        }

        const data = response.body;

        if (!data) {
                setLoading(false);
                alert('Something went wrong');
                return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();

        let fullResponse = "";

        const id = await addBotMessageToChatHistory('<Loading>')
    
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
    
            const chunkValue = await decoder.decode(value);
            fullResponse += chunkValue;
            stateUpdateMessageById(id, fullResponse);
        }
        await updateMessageById(id, fullResponse)

        setLoading(false);
        setInputCode('');
    };

    return {
        chatHistory, 
        setChatHistory,
        inputOnSubmit, 
        setInputOnSubmit, 
        inputCode, 
        setInputCode, 
        outputCode, 
        setOutputCode, 
        model, 
        setModel, 
        loading, 
        setLoading, 
        clearChatHistory, 
        handleChat,
        addUserMessageToChatHistory,
        addBotMessageToChatHistory,
    };
}
