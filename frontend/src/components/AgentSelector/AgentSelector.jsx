import React from 'react';
import { Bot, Cloud, MessageCircle, Zap, Brain } from 'lucide-react';

const AgentSelector = ({ agents, currentAgent, onAgentChange }) => {
  const getAgentIcon = (agentId) => {
    switch (agentId) {
      case 'chatbot':
        return <MessageCircle className="h-5 w-5" />;
      case 'fact-agent':
        return <Brain className="h-5 w-5" />;
      case 'weather-agent':
        return <Cloud className="h-5 w-5" />;
      case 'assistant':
        return <Bot className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const getAgentDescription = (agent) => {
    return agent.description || 'AI assistant';
  };

  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onAgentChange(agent.id)}
          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
            currentAgent === agent.id
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${
              currentAgent === agent.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {getAgentIcon(agent.id)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">
                {agent.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getAgentDescription(agent)}
              </div>
            </div>
          </div>
        </button>
      ))}
      
      {agents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Loading agents...</p>
        </div>
      )}
    </div>
  );
};

export default AgentSelector;