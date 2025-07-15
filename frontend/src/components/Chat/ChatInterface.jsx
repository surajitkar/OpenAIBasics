import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Loader2, Trash2 } from 'lucide-react';

const ChatInterface = ({ agent, apiStatus }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear messages when agent changes
    setMessages([]);
    setError(null);
  }, [agent]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || apiStatus !== 'connected') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (agent === 'chatbot') {
        response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input.trim() }),
        });
      } else if (agent === 'fact-agent' || agent === 'weather-agent') {
        response = await fetch(`http://localhost:3001/api/agents/${agent}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input.trim() }),
        });
      } else {
        // Default to chatbot for other agents
        response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input.trim() }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      let assistantMessage = {
        role: 'assistant',
        content: data.reply,
      };

      // Add metadata for agents
      if (data.agentName) {
        assistantMessage.agentName = data.agentName;
      }
      if (data.toolsUsed && data.toolsUsed.length > 0) {
        assistantMessage.toolsUsed = data.toolsUsed;
      }
      if (data.usage) {
        assistantMessage.usage = data.usage;
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${err.message}. Please check if the API server is running and your OpenAI API key is configured.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  const getMessageStyle = (message) => {
    switch (message.role) {
      case 'user':
        return 'chat-message user';
      case 'assistant':
        return 'chat-message assistant';
      case 'error':
        return 'chat-message error';
      default:
        return 'chat-message';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">
              Welcome to OpenAI Hackathon Starter!
            </div>
            <p className="text-sm">
              Start a conversation with your selected AI agent.
            </p>
            {apiStatus !== 'connected' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                <AlertCircle className="h-5 w-5 inline mr-2" />
                API server not connected. Please start the backend server.
              </div>
            )}
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={getMessageStyle(message)}>
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Show metadata for agent responses */}
                {message.role === 'assistant' && (message.agentName || message.toolsUsed || message.usage) && (
                  <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                    {message.agentName && (
                      <div>Agent: {message.agentName}</div>
                    )}
                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div>Tools used: {message.toolsUsed.join(', ')}</div>
                    )}
                    {message.usage && (
                      <div>
                        Tokens: {message.usage.prompt_tokens} prompt + {message.usage.completion_tokens} completion = {message.usage.total_tokens} total
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                apiStatus === 'connected' 
                  ? "Type your message..." 
                  : "API not connected..."
              }
              disabled={isLoading || apiStatus !== 'connected'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading || apiStatus !== 'connected'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Send</span>
          </button>
          
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearMessages}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              title="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;