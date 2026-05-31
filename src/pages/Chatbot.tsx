import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('https://agrinex-backend-c1ig.onrender.com/api/chat/history').then(res => {
      if (res.data.length > 0) setMessages(res.data);
      else setMessages([{ id: 1, text: "I am AgriNex AI. Ask me for smart farming insights.", is_ai: true }]);
    }).catch(() => setMessages([{ id: 1, text: "I am AgriNex AI.", is_ai: true }]));
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMsg = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;
    const newMsg = { id: Date.now(), text: textToSend, is_ai: false };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    const typingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: typingId, text: "...", is_ai: true, isTyping: true }]);

    try {
      const res = await axios.post('https://agrinex-backend-c1ig.onrender.com/api/chat', { message: textToSend });
      setMessages(prev => prev.map((m: any) => m.id === typingId ? { id: res.data.id, text: res.data.message, is_ai: true } : m));
    } catch (_) {
      setMessages(prev => prev.map((m: any) => m.id === typingId ? { id: typingId, text: "Connection error.", is_ai: true } : m));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col bg-bgMain relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan/5 rounded-full blur-[100px]" />

      <div className="pt-8 pb-4 px-6 bg-bgMain/80 backdrop-blur-xl border-b border-borderDark flex items-center gap-3 z-20 sticky top-0">
        <div className="w-10 h-10 rounded-xl bg-card border border-borderDark flex items-center justify-center text-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]"><SparklesIcon className="w-5 h-5" /></div>
        <div><h1 className="text-sm font-bold text-textMain tracking-wide">AgriGPT</h1><p className="text-[10px] text-cyan uppercase tracking-widest font-bold">Enterprise AI Active</p></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 relative z-10">
        <AnimatePresence>
          {messages.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${m.is_ai ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] p-4 text-sm leading-relaxed shadow-lg ${m.is_ai ? 'glass-card text-textMain rounded-tl-sm border-l-2 border-l-cyan' : 'bg-gradient-to-r from-purple to-cyan rounded-[20px] rounded-tr-sm text-white font-medium'}`}>
                {(m as any).isTyping ? <motion.div className="flex gap-1" animate="animate">{[0, 1, 2].map(i => <motion.div key={i} className="w-2 h-2 bg-textSec rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />)}</motion.div> : (m.message || m.text)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="absolute bottom-0 w-full px-4 bg-gradient-to-t from-bgMain via-bgMain to-transparent pb-6 pt-6 z-30">
        <div className="glass-card p-2 flex items-end gap-2 bg-bgSec/90">
          <textarea className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-3 text-sm text-textMain placeholder-textSec outline-none" placeholder="Ask AI..." rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`p-3 rounded-xl flex items-center justify-center transition-all ${input.trim() ? 'bg-cyan text-bgMain shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-card text-textSec border border-borderDark'}`} onClick={() => sendMsg()} disabled={!input.trim()}>
            <PaperAirplaneIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
