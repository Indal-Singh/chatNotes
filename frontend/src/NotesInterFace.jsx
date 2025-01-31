import React, { useState } from 'react';
import { Plus, FileText, MessageCircle } from 'lucide-react';
import RichMessageBox from './RichMessageBox';
const NotesInterFace = () => {
  const [topics, setTopics] = useState([
    { id: 1, name: 'Work Projects', messages: [] },
    { id: 2, name: 'Personal Goals', messages: [] }
  ]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  const addTopic = () => {
    if (newTopicName.trim()) {
      const newTopic = {
        id: topics.length + 1,
        name: newTopicName,
        messages: []
      };
      setTopics([...topics, newTopic]);
      setNewTopicName('');
      setIsAddingTopic(false);
    }
  };

  const addMessage = (message) => {
    if (selectedTopic) {
      const updatedTopics = topics.map(topic => 
        topic.id === selectedTopic.id 
          ? {
              ...topic, 
              messages: [...topic.messages, {
                id: topic.messages.length + 1,
                text: message,
                timestamp: new Date().toLocaleString()
              }]
            }
          : topic
      );
      setTopics(updatedTopics);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white">
      {/* Sidebar */}
      <div className={`w-full md:w-80 bg-[#1a1a1a] border-b md:border-b-0 md:border-r border-[#333] p-6 ${selectedTopic ? 'hidden md:block' : 'block'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-[#ff1744]" />
            <h1 className="text-2xl font-bold text-[#ff1744]">ChatNotes</h1>
          </div>
          <button 
            onClick={() => setIsAddingTopic(true)}
            className="text-[#fe0a3b] hover:bg-[#333] p-2 rounded-full"
          >
            <Plus />
          </button>
        </div>

        {isAddingTopic && (
          <div className="mb-4 flex space-x-2">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Enter topic name"
              className="flex-1 bg-[#0a0a0a] border border-[#333] p-2 rounded text-white"
            />
            <button 
              onClick={addTopic}
              className="bg-[#f80a39] text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        )}

        {topics.map(topic => (
          <div
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className={`p-4 rounded-lg cursor-pointer transition mb-2 ${
              selectedTopic?.id === topic.id 
                ? 'bg-[#333]' 
                : 'hover:bg-[#333]'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[#ff1744]">{topic.name}</h3>
              <span className="text-xs text-gray-400">{topic.messages.length} notes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        {selectedTopic ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#ff1744]">{selectedTopic.name}</h2>
              <MessageCircle className="text-[#ff1744]" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedTopic.messages.map(message => (
                <div 
                  key={message.id} 
                  className="bg-[#1a1a1a] p-4 rounded-lg"
                >
                  <p className="text-white">{message.text}</p>
                  <span className="text-xs text-gray-400 block mt-2">
                    {message.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-[#333]">
              <RichMessageBox/>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select or create a topic to start taking notes
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesInterFace;