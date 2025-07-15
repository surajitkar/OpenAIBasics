import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, Settings, Zap } from 'lucide-react';
import ChatInterface from './components/Chat/ChatInterface';
import AgentSelector from './components/AgentSelector/AgentSelector';
import SettingsPanel from './components/Settings/SettingsPanel';
import './App.css';

function App() {
  const [currentAgent, setCurrentAgent] = useState('chatbot');
  const [showSettings, setShowSettings] = useState(false);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [agents, setAgents] = useState([]);

  // Check API health on startup
  useEffect(() => {
    checkApiHealth();
    loadAgents();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('disconnected');
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected': return 'API Connected';
      case 'error': return 'API Error';
      case 'disconnected': return 'API Disconnected';
      default: return 'Checking...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">OpenAI Hackathon Starter</h1>
                <p className="text-sm text-gray-600">Interactive AI Assistant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                AI Agents
              </h2>
              <AgentSelector
                agents={agents}
                currentAgent={currentAgent}
                onAgentChange={setCurrentAgent}
              />
            </div>
            
            {showSettings && (
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
                <SettingsPanel onClose={() => setShowSettings(false)} />
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {agents.find(a => a.id === currentAgent)?.name || 'Chat'}
                  </span>
                </div>
                <button
                  onClick={checkApiHealth}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh Connection
                </button>
              </div>
              
              <ChatInterface 
                agent={currentAgent}
                apiStatus={apiStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
