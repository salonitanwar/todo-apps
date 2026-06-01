
import React, { useState, useEffect } from 'react';
// Lucide icons list mein tags ke icons aur baki utility icons hain
import { 
  Plus, Menu, User, Settings, Trash2, CheckCircle, Circle, 
  Lock, Unlock, Search, Edit3, X, Check, Smile,
  Briefcase, BriefcaseBusiness, UserCheck, AlertTriangle, AlertCircle, ShoppingBag, Lightbulb, ClipboardList 
} from 'lucide-react';
import Background3D from './components/Background3D';
import TagsList from './components/TagsList';
import CreateTodoModal from './components/CreateTodoModal';
import SettingsModal from './components/SettingsModal';
import SplashScreen from './components/SplashScreen'; // 🔥 STEP 1: Splash Screen component import kiya

export default function App() {
  // 🔥 STEP 2: Splash screen ko trigger karne ke liye true state banayi hai
  const [showSplash, setShowSplash] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilterTag, setSelectedFilterTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Task States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTag, setEditTag] = useState('GENERAL');

  // Settings State
  const [appSettings, setAppSettings] = useState(() => {
    const savedSettings = localStorage.getItem('todo_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      defaultPriority: 'MEDIUM',
      autoDeleteCompleted: false,
      sortBy: 'Date',
      showCompleted: true,
      theme: 'dark',
      fontSize: 'base',
      isAppLockEnabled: false,
      appLockPin: ''
    };
  });

  // Security Lock State
  const [isAppLocked, setIsAppLocked] = useState(() => {
    return appSettings.isAppLockEnabled && appSettings.appLockPin !== '';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('my_todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (appSettings.theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
    localStorage.setItem('todo_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    if (appSettings.isAppLockEnabled && appSettings.appLockPin !== '') {
      setIsAppLocked(true);
    } else {
      setIsAppLocked(false);
    }
  }, [appSettings.isAppLockEnabled, appSettings.appLockPin]);

  useEffect(() => {
    localStorage.setItem('my_todos', JSON.stringify(todos));
  }, [todos]);

  const handleDirectUnlock = () => {
    const savedPin = String(appSettings.appLockPin || '').trim();
    const typedPin = String(enteredPin || '').trim();
    if (typedPin === savedPin) {
      setIsAppLocked(false);
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
      setEnteredPin('');
    }
  };

  const handleToggleComplete = (id) => {
    if (appSettings.autoDeleteCompleted) {
      setTodos(todos.filter(todo => todo.id !== id));
    } else {
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    }
  };

  const handleSaveTodo = (text, tag) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      tag: tag,
      completed: false,
      priority: appSettings.defaultPriority,
      dateAdded: new Date().getTime()
    };
    setTodos([newTodo, ...todos]);
  };

  const openEditModal = (todo) => {
    setTaskBeingEdited(todo);
    setEditText(todo.text);
    setEditTag(todo.tag || 'GENERAL');
    setIsEditModalOpen(true);
  };

  const handleUpdateTodo = (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    setTodos(todos.map(todo => todo.id === taskBeingEdited.id ? { ...todo, text: editText, tag: editTag } : todo));
    setIsEditModalOpen(false);
    setTaskBeingEdited(null);
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getProcessedTodos = () => {
    let list = [...todos];
    if (!appSettings.showCompleted && !appSettings.autoDeleteCompleted) {
      list = list.filter(todo => !todo.completed);
    }
    if (selectedFilterTag !== 'ALL') {
      list = list.filter(todo => todo.tag === selectedFilterTag);
    }
    if (searchQuery.trim() !== '') {
      list = list.filter(todo => 
        todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.tag && todo.tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (appSettings.sortBy === 'Date') {
      list.sort((a, b) => b.dateAdded - a.dateAdded);
    } else if (appSettings.sortBy === 'Priority') {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      list.sort((a, b) => weight[b.priority] - weight[a.priority]);
    } else if (appSettings.sortBy === 'Status') {
      list.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
    }
    return list;
  };

  // --- WORK ICON MAPPING SYSTEM ---
  const getTaskIcon = (tag) => {
    const iconProps = { size: 16, className: "shrink-0" };
    switch (tag) {
      case 'WORK': return <BriefcaseBusiness {...iconProps} className="text-yellow-400" />;
      case 'PERSONAL': return <UserCheck {...iconProps} className="text-green-400" />;
      case 'IMPORTANT': return <AlertTriangle {...iconProps} className="text-orange-400" />;
      case 'URGENT': return <AlertCircle {...iconProps} className="text-red-400" />;
      case 'SHOPPING': return <ShoppingBag {...iconProps} className="text-emerald-400" />;
      case 'IDEA': return <Lightbulb {...iconProps} className="text-purple-400" />;
      default: return <ClipboardList {...iconProps} className="text-blue-400" />;
    }
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case 'PERSONAL': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'WORK': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'IMPORTANT': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'URGENT': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'SHOPPING': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'IDEA': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return 'text-red-400';
    if (priority === 'MEDIUM') return 'text-yellow-400';
    return 'text-blue-400';
  };

  const processedTodos = getProcessedTodos();

  // 🔥 STEP 3: Sabse pehle Splash Screen dikhane ka logic yahan apply kiya hai
  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  // --- SAFE SCREEN AREA: Splash Screen ke khatam hone par ye code run hoga ---
  if (isAppLocked && appSettings.isAppLockEnabled) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#090d16] text-white font-sans">
        <Background3D />
        <div className="relative w-full max-w-md backdrop-blur-2xl bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl text-center z-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-rose-500/10 border border-rose-500/30 flex items-center justify-center rounded-2xl text-rose-400">
            <Lock size={32} className="animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold mb-2">App is Locked</h2>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              maxLength={4}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleDirectUnlock(); }}
              placeholder="••••"
              className={`bg-black/50 border ${pinError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-2xl text-center focus:outline-none`}
            />
            <button type="button" onClick={handleDirectUnlock} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2">
              <Unlock size={18} /> Unlock App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen w-full transition-all duration-500 overflow-hidden font-sans flex flex-col justify-between p-6 ${appSettings.theme === 'light' ? 'text-slate-900 bg-slate-100/10' : 'text-white'}`}>
      <Background3D />

      {/* --- TOP NAVBAR --- */}
      <header className={`backdrop-blur-md border px-6 py-4 flex justify-between items-center w-full shadow-lg z-20 rounded-2xl ${appSettings.theme === 'light' ? 'bg-white/40 border-slate-200' : 'bg-black/20 border-white/10'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer transition-transform duration-200 active:scale-95">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-wide">Todo App</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSettingsOpen(true)} className="hover:rotate-45 transition-all duration-300 cursor-pointer">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col md:flex-row items-start justify-between w-full my-8 z-10 gap-6 relative">
        {isMenuOpen && (
          <div className="w-full md:w-auto flex justify-start sticky top-24 z-20">
            <TagsList selectedTag={selectedFilterTag} onTagSelect={setSelectedFilterTag} />
          </div>
        )}

        <div className="flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col gap-6 items-center">
          {/* SEARCH BAR */}
          <div className="w-full max-w-md relative z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border backdrop-blur-md focus:outline-none bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* NOTES GRID DISPLAY AREA */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {processedTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={`backdrop-blur-md border rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all duration-300 ${todo.completed ? 'opacity-50 line-through' : ''} bg-white/5 border-white/10`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleComplete(todo.id)} className="text-blue-500 cursor-pointer">
                      {todo.completed ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} />}
                    </button>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${getTagColor(todo.tag)}`}>
                      {todo.tag}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    <button onClick={() => openEditModal(todo)} className="text-white/40 hover:text-blue-400 cursor-pointer">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-white/40 hover:text-red-500 cursor-pointer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* ICON & TEXT AREA */}
                <div className="flex items-start gap-2.5 mt-1">
                  {getTaskIcon(todo.tag)}
                  <p className="text-sm font-medium break-words text-white/95 flex-1 leading-tight">
                    {todo.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- BOTTOM SECTION --- */}
      <footer className="w-full flex justify-center items-end pb-2 z-10">
        <button onClick={() => setIsModalOpen(true)} className="bg-[#0d1527] border border-white/20 text-white p-5 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 cursor-pointer">
          <Plus size={32} className="text-emerald-400" />
        </button>
      </footer>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <form onSubmit={handleUpdateTodo} className="relative w-full max-w-md backdrop-blur-xl bg-[#0f172a]/95 border border-white/10 rounded-2xl p-6 shadow-2xl text-white flex flex-col gap-4">
            <h3 className="text-lg font-bold">Edit Your Task Details</h3>
            <div className="flex flex-col gap-1 relative">
              <label className="text-xs text-white/50 font-bold uppercase">Task Text</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-sm focus:outline-none"
                  required
                />
                <button type="button" onClick={() => { const panel = document.getElementById('edit-emoji-panel'); if(panel) panel.classList.toggle('hidden'); }} className="absolute right-3 text-white/40 hover:text-yellow-400 cursor-pointer">
                  <Smile size={18} />
                </button>
              </div>
              <div id="edit-emoji-panel" className="hidden mt-2 p-2 bg-slate-800 border border-white/10 rounded-xl flex flex-wrap gap-2 justify-center">
                {['🎯', '💻', '📝', '🔥', '✅'].map((emoji, idx) => (
                  <button key={idx} type="button" onClick={() => setEditText((prev) => prev + emoji)} className="text-lg hover:scale-125 cursor-pointer">{emoji}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50 font-bold uppercase">Update Tag (Icon changes automatically)</label>
              <select value={editTag} onChange={(e) => setEditTag(e.target.value)} className="bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm cursor-pointer focus:outline-none">
                {['GENERAL', 'PERSONAL', 'WORK', 'IMPORTANT', 'URGENT', 'SHOPPING', 'IDEA'].map((tag) => (
                  <option key={tag} value={tag} className="bg-[#0f172a]">{tag}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold cursor-pointer">Update Task</button>
            </div>
          </form>
        </div>
      )}

      <CreateTodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTodo} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={appSettings} onUpdateSettings={setAppSettings} />
    </div>
  );
}