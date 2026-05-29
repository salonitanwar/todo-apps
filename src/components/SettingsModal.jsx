
import React, { useState } from 'react';
import { X, Sliders, Eye, Trash2, Palette, Type, Sun, Moon, Shield, Lock, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
  const [pinInput, setPinInput] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  
  const handleSavePin = (e) => {
    e.preventDefault();
    const cleanPin = String(pinInput).trim();
    if (cleanPin.length === 4) {
      onUpdateSettings({
        ...settings,
        appLockPin: cleanPin,
        isAppLockEnabled: true
      });
      setPinInput('');
      setIsSettingPin(false);
      alert('PIN set successfully!');
    } else {
      alert('Kripya 4-digit ka PIN dalein.');
    }
  };

  const handleRemovePin = () => {
    onUpdateSettings({
      ...settings,
      appLockPin: '',
      isAppLockEnabled: false
    });
    setPinInput('');
    setIsSettingPin(false);
    alert('App Lock complete disable kar diya gaya hai.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-lg backdrop-blur-2xl bg-[#0f172a]/90 border border-white/10 rounded-3xl p-6 shadow-2xl text-white max-h-[85vh] overflow-y-auto custom-scrollbar animate-fade-in">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors cursor-pointer">
          <X size={22} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Sliders className="text-emerald-400 animate-pulse" size={24} />
          <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            App Settings Panel
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          
         
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
              <Palette size={14} /> Appearance Settings
            </h3>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold">Theme Mode</p>
                <p className="text-[11px] text-white/40">Interface color change karein</p>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                <button 
                  type="button"
                  onClick={() => handleChange('theme', 'light')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${settings.theme === 'light' ? 'bg-yellow-500 text-black font-bold' : 'text-white/60'}`}
                >
                  <Sun size={14} /> Light
                </button>
                <button 
                  type="button"
                  onClick={() => handleChange('theme', 'dark')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${settings.theme === 'dark' ? 'bg-indigo-600 text-white font-bold' : 'text-white/60'}`}
                >
                  <Moon size={14} /> Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-sm font-semibold">Font Size (Accessibility)</p>
                <p className="text-[11px] text-white/40">App ka text size badlein</p>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
                {['sm', 'base', 'lg'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleChange('fontSize', size)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${settings.fontSize === size ? 'bg-blue-500 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    {size === 'base' ? 'md' : size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: TASK PREFERENCES */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
              <Type size={14} /> Task Preferences
            </h3>

            <div className="mb-4">
              <label className="block text-xs text-white/50 font-semibold mb-2">Default Task Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleChange('defaultPriority', p)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${settings.defaultPriority === p ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-black/20 text-white/40 border-transparent'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mb-4">
              <div className="flex items-center gap-2.5">
                <Trash2 size={16} className="text-red-400" />
                <div>
                  <p className="text-sm font-semibold">Auto Delete Completed Tasks</p>
                  <p className="text-[11px] text-white/40">Complete hote hi task permanent hatayein</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoDeleteCompleted || false}
                  onChange={(e) => handleChange('autoDeleteCompleted', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-2.5">
                <Eye size={16} className="text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold">Show Completed Tasks</p>
                  <p className="text-[11px] text-white/40">Poore ho chuke kaamon ko list mein rakhein</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={settings.autoDeleteCompleted}
                  checked={settings.showCompleted !== false}
                  onChange={(e) => handleChange('showCompleted', e.target.checked)}
                  className="sr-only peer disabled:opacity-30"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          {/* SECTION 3: SECURITY */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">
              <Shield size={14} /> Security & Privacy
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock size={16} className="text-rose-400" />
                <div>
                  <p className="text-sm font-semibold">Secure App Lock (PIN)</p>
                  <p className="text-[11px] text-white/40">
                    {settings.isAppLockEnabled ? `Status: Active (PIN: ${settings.appLockPin})` : 'App ko kholte waqt verification'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {settings.isAppLockEnabled ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setIsSettingPin(!isSettingPin)}
                      className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs rounded-xl font-bold cursor-pointer hover:bg-blue-500/30"
                    >
                      {isSettingPin ? 'Cancel' : 'Change PIN'}
                    </button>
                    <button 
                      type="button"
                      onClick={handleRemovePin}
                      className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs rounded-xl font-bold cursor-pointer hover:bg-red-500/30"
                    >
                      Disable
                    </button>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsSettingPin(!isSettingPin)}
                    className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs rounded-xl font-bold cursor-pointer hover:bg-emerald-500/30"
                  >
                    {isSettingPin ? 'Cancel' : 'Set PIN'}
                  </button>
                )}
              </div>
            </div>

            {isSettingPin && (
              <form onSubmit={handleSavePin} className="mt-4 pt-4 border-t border-white/5 flex gap-2 items-center">
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d*"
                  inputMode="numeric"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter New 4-Digit PIN"
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:border-rose-500 flex-1"
                  required
                />
                <button type="submit" className="bg-rose-500 text-white p-2.5 rounded-xl hover:bg-rose-600 transition-colors cursor-pointer">
                  <Check size={16} />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}