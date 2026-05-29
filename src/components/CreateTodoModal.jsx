import React, { useState, useEffect, useRef } from 'react';
import { X, Smile, Search, Mic, MicOff } from 'lucide-react';

export default function CreateTodoModal({ isOpen, onClose, onSave }) {
  const [taskText, setTaskText] = useState('');
  const [selectedTag, setSelectedTag] = useState('PERSONAL');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const suggestions = ['PERSONAL', 'WORK', 'IMPORTANT', 'URGENT', 'SHOPPING', 'IDEA'];
  
  const emojiLibrary = [
    { char: '😀', name: 'happy smile grin' }, { char: '😂', name: 'laugh lol haha' },
    { char: '🤣', name: 'rofl laugh floor' }, { char: '😉', name: 'wink' },
    { char: '🥰', name: 'love heart eyes' }, { char: '😎', name: 'cool sunglasses' },
    { char: '🤔', name: 'think confuse' }, { char: '😴', name: 'sleep tired' },
    { char: '💻', name: 'laptop code work computer' }, { char: '📝', name: 'note write paper text' },
    { char: '📚', name: 'books study read learn' }, { char: '🎯', name: 'target goal focus' },
    { char: '📊', name: 'chart graph business' }, { char: '💡', name: 'idea bulb light' },
    { char: '🔥', name: 'fire hot lit' }, { char: '✅', name: 'done check right' },
    { char: '🚨', name: 'alert danger emergency' }, { char: '🛒', name: 'shop cart buy' },
    { char: '💰', name: 'money cash rich' }, { char: '📅', name: 'date calendar schedule' },
    { char: '🏃', name: 'run gym fitness walk' }, { char: '🏡', name: 'home house family' },
    { char: '🎉', name: 'party celebrate fun' }
  ];

  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false; 
      rec.interimResults = false;
      
      
      rec.lang = 'en-IN'; 

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          
          const inputEl = document.getElementById('task-input-field');
          if (inputEl) {
            const currentText = inputEl.value;
            const newText = currentText.trim() ? currentText + ' ' + transcript : transcript;
            setTaskText(newText);
          }
        }
      };

      rec.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone Access Blocked! ");
        }
      };

      recognitionRef.current = rec;
    }
  }, [isOpen]); 

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Not Microphone Voice Allow");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setShowEmojiPicker(false);
      try {
        recognitionRef.current.start();
      } catch (error) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    onSave(taskText, selectedTag);
    setTaskText('');
    setSelectedTag('PERSONAL');
    setShowEmojiPicker(false);
    setEmojiSearch('');
    onClose();
  };

  const handleEmojiClick = (emojiChar) => {
    setTaskText((prev) => prev + emojiChar);
  };

  const filteredEmojis = emojiLibrary.filter(emoji => 
    emoji.name.toLowerCase().includes(emojiSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-[#0f172a]/90 border border-white/10 rounded-2xl p-6 shadow-2xl text-white transform transition-all scale-100 animate-fade-in">
        
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Create New Task
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs text-white/60 font-bold uppercase tracking-wider">
                Task / Note
              </label>
              {isListening && (
                <span className="text-xs text-red-400 font-bold animate-pulse flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full">
                  ● Speak Now
                </span>
              )}
            </div>
            
            <div className="relative flex items-center">
              
              <input
                id="task-input-field"
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder={isListening ? "Listening" : "Type or click mic to speak..."}
                className={`w-full bg-black/30 border rounded-xl pl-4 pr-24 py-3 text-white placeholder-white/30 focus:outline-none transition-all ${
                  isListening ? 'border-red-500 ring-2 ring-red-500/20 bg-red-950/10' : 'border-white/10 focus:border-blue-500'
                }`}
                required
              />
              
              <div className="absolute right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    isListening ? 'text-red-400 bg-red-500/20' : 'text-white/50 hover:text-blue-400 hover:bg-white/5'
                  }`}
                  title={isListening ? "Stop" : "Speak Task"}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    showEmojiPicker ? 'text-yellow-400 bg-white/10' : 'text-white/50 hover:text-yellow-400 hover:bg-white/5'
                  }`}
                >
                  <Smile size={18} />
                </button>
              </div>
            </div>

            {showEmojiPicker && (
              <div className="absolute left-0 right-0 mt-2 p-3 bg-[#1e293b] border border-white/15 rounded-xl shadow-2xl z-30 animate-fade-in flex flex-col gap-2">
                <div className="relative flex items-center">
                  <Search size={12} className="absolute left-2 text-white/40" />
                  <input 
                    type="text"
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    placeholder="Search emoji..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-7 pr-2 py-1 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-7 gap-2 max-h-36 overflow-y-auto p-1 custom-scrollbar justify-items-center">
                  {filteredEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiClick(emoji.char)}
                      className="text-2xl p-0.5 hover:bg-white/10 rounded-lg transition-all transform hover:scale-125 active:scale-95 cursor-pointer"
                    >
                      {emoji.char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={showEmojiPicker ? "mt-48 transition-all duration-300" : "transition-all duration-300"}>
            <label className="block text-xs text-white/60 font-bold uppercase tracking-wider mb-2">Select Your Suggestion</label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedTag === tag ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 cursor-pointer">
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}