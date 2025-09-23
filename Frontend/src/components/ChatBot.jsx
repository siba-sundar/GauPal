import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [typedMessage, setTypedMessage] = useState('');

  // Colors for the green theme
  const theme = {
    primary: '#2E7D32', // Dark green
    light: '#4CAF50',   // Medium green
    lighter: '#8BC34A', // Light green
    lightest: '#E8F5E9', // Very light green background
    text: '#1B5E20',    // Dark green text
    white: '#FFFFFF'    // White
  };

  // Markdown components for custom rendering
  const MarkdownComponents = {
    strong: ({node, ...props}) => (
      <strong style={{ fontWeight: 'bold' }} {...props} />
    ),
    em: ({node, ...props}) => (
      <em style={{ fontStyle: 'italic' }} {...props} />
    ),
  };

  useEffect(() => {
    // Fetch initial greeting when component mounts
    fetchGreeting();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const fetchGreeting = async () => {
    try {
      console.log('Fetching greeting...');
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/gauguru/greeting`);
      const data = await response.json();
      console.log('Greeting response:', data);
      
      if (response.ok && data.greeting) {
        setMessages([{ text: data.greeting, isUser: false, displayOnly: true }]);
      } else {
        // Handle case where response is ok but no greeting
        setMessages([{ text: "Hello! How can I help you today?", isUser: false, displayOnly: true }]);
      }
    } catch (error) {
      console.error('Error fetching greeting:', error);
      // Fallback greeting if API call fails
      setMessages([{ 
        text: "Hello! How can I help you today?", 
        isUser: false,
        displayOnly: true 
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Typing effect
  useEffect(() => {
    let timeoutId;
    if (streamingMessage) {
      const chars = streamingMessage.split('');
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < chars.length) {
          setTypedMessage(prev => prev + chars[currentIndex]);
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, 20); // Adjust speed here
        }
      };

      typeNextChar();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [streamingMessage]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userMessage = input.trim();
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message:', userMessage);
      
      // Prepare chat history for the API - exclude greeting/displayOnly messages
      const chatHistory = messages
        .filter(msg => !msg.displayOnly)
        .map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          content: msg.text
        }));

      // Create the request body
      const requestBody = {
        message: userMessage,
        chatHistory: chatHistory,
        modelName: 'gemini-2.0-flash'  // Specify the Gemini 2.0 Flash model
      };

      console.log('Request payload:', JSON.stringify(requestBody));

      // Send request to the API
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/gauguru/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.response) {
        setMessages(prev => [...prev, { 
          text: data.response, 
          isUser: false 
        }]);
      } else {
        throw new Error(data.error || data.details || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error in chat response:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingChat = async () => {
    if (input.trim() === '') return;
    
    const userMessage = input.trim();
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      // Prepare chat history for the API - exclude greeting/displayOnly messages
      const chatHistory = messages
        .filter(msg => !msg.displayOnly)
        .map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          content: msg.text
        }));

      // Create the request body
      const requestBody = {
        message: userMessage,
        chatHistory: chatHistory,
        modelName: 'gemini-2.0-flash'  // Specify the Gemini 2.0 Flash model
      };

      console.log('Streaming request payload:', JSON.stringify(requestBody));

      // Send POST request for streaming
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/gauguru/chat?stream=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      const processStream = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            
            if (done) {
              setMessages(prev => [...prev, { text: fullResponse, isUser: false }]);
              setIsLoading(false);
              setStreamingMessage('');
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');
            
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const data = line.substring(5).trim();
                
                if (data === '[DONE]') {
                  setMessages(prev => [...prev, { text: fullResponse, isUser: false }]);
                  setIsLoading(false);
                  setStreamingMessage('');
                  return;
                }
                
                try {
                  const parsedData = JSON.parse(data);
                  if (parsedData.text) {
                    fullResponse += parsedData.text;
                    setStreamingMessage(fullResponse);
                  }
                } catch (e) {
                  console.error('Error parsing stream data:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          if (!fullResponse) {
            setMessages(prev => [...prev, { 
              text: "Sorry, I'm having trouble with streaming. Please try again.", 
              isUser: false 
            }]);
          } else {
            setMessages(prev => [...prev, { text: fullResponse, isUser: false }]);
          }
          setIsLoading(false);
          setStreamingMessage('');
        }
      };

      processStream();
      
    } catch (error) {
      console.error('Error setting up streaming:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting. Please try again.", 
        isUser: false 
      }]);
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden h-full" style={{ backgroundColor: theme.white }}>
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ backgroundColor: theme.lightest }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Loading your assistant...</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-3 max-w-xs rounded-lg p-3 ${message.isUser ? 'ml-auto' : 'mr-auto'}`}
              style={{ 
                backgroundColor: message.isUser ? theme.light : theme.white,
                color: message.isUser ? theme.white : theme.text,
                borderRadius: message.isUser ? '12px 12px 0 12px' : '12px 12px 12px 0'
              }}
            >
              <ReactMarkdown 
                components={MarkdownComponents}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          ))
        )}
        
        {/* Streaming/Typed message */}
        {(streamingMessage || typedMessage) && (
          <div 
            className="mb-3 max-w-xs rounded-lg p-3 mr-auto"
            style={{ 
              backgroundColor: theme.white,
              color: theme.text,
              borderRadius: '12px 12px 12px 0'
            }}
          >
            <ReactMarkdown 
              components={MarkdownComponents}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {typedMessage}
            </ReactMarkdown>
          </div>
        )}
        
        {isLoading && !streamingMessage && (
          <div className="flex space-x-1 ml-2">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme.primary }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce delay-75" style={{ backgroundColor: theme.primary }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce delay-150" style={{ backgroundColor: theme.primary }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t p-3 flex" style={{ borderColor: theme.lightest }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 rounded-l-full py-2 px-4 focus:outline-none"
          style={{ borderColor: theme.light, backgroundColor: theme.lightest, color: theme.text }}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={input.trim() === '' || isLoading}
          className="rounded-r-full py-2 px-4 font-semibold disabled:opacity-50"
          style={{ backgroundColor: theme.primary, color: theme.white }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
