import React, { useState } from 'react';
import { Key, Globe, X, ExternalLink, AlertCircle } from 'lucide-react';

const SettingsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('api');

  const tabs = [
    { id: 'api', label: 'API Settings', icon: Key },
    { id: 'about', label: 'About', icon: Globe },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'api' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">API Configuration</h3>
              </div>
              <div className="space-y-3 text-sm text-blue-800">
                <p>
                  This frontend connects to your backend API server which needs to be configured with your OpenAI API key.
                </p>
                <div className="bg-blue-100 p-3 rounded border">
                  <p className="font-medium mb-1">Environment Variables Required:</p>
                  <ul className="space-y-1 text-xs font-mono">
                    <li>• OPENAI_API_KEY (required)</li>
                    <li>• OPENAI_ORG_ID (optional)</li>
                    <li>• WEATHER_API_KEY (optional)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Setup Instructions:</h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. Get your OpenAI API key from the OpenAI dashboard</li>
                <li>2. Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in the project root</li>
                <li>3. Add your API key: <code className="bg-gray-100 px-2 py-1 rounded">OPENAI_API_KEY=your_key_here</code></li>
                <li>4. Start the backend server: <code className="bg-gray-100 px-2 py-1 rounded">node api-server.js</code></li>
              </ol>
            </div>

            <div className="pt-3 border-t">
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Get OpenAI API Key</span>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">OpenAI Hackathon Starter</h3>
              <p className="text-sm text-gray-600">
                A comprehensive Node.js project demonstrating OpenAI API capabilities across 5 learning modules, 
                now with a modern React frontend interface.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Available Modules:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Foundations:</strong> Core OpenAI API setup and cost tracking</li>
                <li>• <strong>Chatbot:</strong> Interactive conversational AI</li>
                <li>• <strong>Advanced:</strong> Function calling with external APIs</li>
                <li>• <strong>Agents:</strong> OpenAI Agents SDK for workflows</li>
                <li>• <strong>Assistants:</strong> Persistent conversations and file handling</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Technology Stack:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Frontend:</strong> React, Vite, Tailwind CSS</li>
                <li>• <strong>Backend:</strong> Node.js, Express, OpenAI SDK</li>
                <li>• <strong>AI:</strong> OpenAI GPT models, Agents SDK</li>
              </ul>
            </div>

            <div className="pt-3 border-t">
              <a
                href="https://github.com/surajitkar/OpenAIBasics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="pt-4 border-t">
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Close Settings</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;