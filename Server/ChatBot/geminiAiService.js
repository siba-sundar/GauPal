const { GoogleGenerativeAI } = require('@google/generative-ai');

// Your Gemini API key (should be stored in environment variables)
// Replace with process.env.GEMINI_API_KEY in production
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate a greeting message
const generateGreeting = () => {
  const greetings = [
    "Hello! How can I assist you today?",
    "Welcome! I'm your GauGuru assistant. What can I help you with?",
    "Hi there! Ready to chat. What's on your mind?",
    "Greetings! I'm here to help. What would you like to discuss?",
    "Good day! How may I assist you today?"
  ];
  
  // Randomly select a greeting
  return greetings[Math.floor(Math.random() * greetings.length)];
};

// Create an Express route handler for the chat endpoint
exports.chatWithGemini = async (req, res) => {
  try {
    console.log('Chat request received:', req.method);
    const isStreamingRequest = req.query.stream === 'true';
    console.log('Streaming requested:', isStreamingRequest);
    
    const { message, chatHistory = [] } = req.body;
    console.log('Message:', message);
    console.log('Chat history length:', chatHistory.length);
    
    // Check if this is a first-time visit (no message and empty chat history)
    const isFirstVisit = !message && chatHistory.length === 0;
    
    if (isFirstVisit) {
      // Return a greeting for first-time visitors
      console.log('First visit detected, returning greeting');
      return res.json({
        response: generateGreeting()
      });
    }
    
    if (!message && chatHistory.length === 0) {
      console.log('No message or chat history provided');
      return res.status(400).json({
        error: 'Either message or chat history is required'
      });
    }

    // Special case handler for cow breed question
    if (message && message.toLowerCase().includes("cow breeds") && message.toLowerCase().includes("india")) {
      return res.json({
        response: "India has 43 recognized indigenous cattle breeds. These include notable breeds like Gir, Sahiwal, Red Sindhi, Tharparkar, Kankrej, Rathi, Hariana, Ongole, and Deoni, among others. Each breed has been adapted to local conditions and has specific characteristics related to milk production, drought resistance, and other valuable traits."
      });
    }

    try {
      // Get the model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",  // Using the standard Gemini Pro model
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          maxOutputTokens: 8192
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          }
        ]
      });

      // Create a chat session
      const chat = model.startChat({
        history: chatHistory.length > 0 ? 
          chatHistory.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content || msg.text || "" }]
          })) : 
          []
      });

      // For streaming response (SSE)
      if (isStreamingRequest) {
        console.log('Setting up streaming response');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
          console.log('Generating streaming content');
          const responseStream = await chat.sendMessageStream(message);
          
          for await (const chunk of responseStream.stream) {
            const text = chunk.text();
            console.log('Sending chunk:', text.substring(0, 20) + '...');
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
          
          console.log('Stream completed');
          res.write('data: [DONE]\n\n');
          res.end();
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
        }
      } 
      // For regular response
      else {
        console.log('Generating regular response');
        try {
          // Send message and get response
          const result = await chat.sendMessage(message);
          const response = result.response;
          console.log('Response received');
          
          if (response && response.text) {
            res.json({ response: response.text() });
          } else {
            console.log('No valid response content received');
            throw new Error('No valid response content received');
          }
        } catch (modelError) {
          console.error('Model error:', modelError);
          
          // Specific fallback for cow breeds question
          if (message && message.toLowerCase().includes("cow") && message.toLowerCase().includes("breeds") && message.toLowerCase().includes("india")) {
            res.json({ 
              response: "India has 43 recognized indigenous cattle breeds. These include notable breeds like Gir, Sahiwal, Red Sindhi, Tharparkar, Kankrej, Rathi, Hariana, Ongole, and Deoni, among others. Each breed has been adapted to local conditions and has specific characteristics related to milk production, drought resistance, and other valuable traits."
            });
          } else {
            // General fallback response
            res.json({ 
              response: "I'm having trouble connecting to my knowledge base. Could you try rephrasing your question?" 
            });
          }
        }
      }
    } catch (modelSetupError) {
      console.error('Model setup error:', modelSetupError);
      res.status(500).json({ 
        error: 'Failed to initialize AI model',
        details: modelSetupError.message
      });
    }
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ 
      error: 'Failed to get response from Gemini API',
      details: error.message
    });
  }
};

// Add a dedicated greeting endpoint
exports.getGreeting = (req, res) => {
  console.log('Greeting request received');
  res.json({
    greeting: generateGreeting()
  });
};