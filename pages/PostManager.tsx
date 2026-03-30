
import React, { useState } from 'react';
import { saveArticleApi } from '../services/api';

const PostManager: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const handleSave = async () => {
    const editor = document.getElementById('editor');
    if (!editor) return;
    
    setIsSaving(true);
    await saveArticleApi({ title, content: editor.innerHTML });
    setIsSaving(false);
    alert('Đã đăng bài thành công!');
    setTitle('');
    editor.innerHTML = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Ads Editor.</h2>
        <p className="text-gray-400 font-bold text-sm italic mt-1">Soạn thảo nội dung quảng cáo chuyên nghiệp</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[24px] outline-none focus:bg-white focus:border-primary font-black text-xl transition-all"
              placeholder="Nhập tiêu đề bắt mắt..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung (Rich Text)</label>
            <div className="border border-gray-100 rounded-[32px] overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-100 flex flex-wrap gap-2">
                <button onClick={() => execCommand('bold')} className="p-3 hover:bg-white rounded-xl font-black transition-all">B</button>
                <button onClick={() => execCommand('italic')} className="p-3 hover:bg-white rounded-xl italic transition-all">I</button>
                <button onClick={() => execCommand('insertUnorderedList')} className="p-3 hover:bg-white rounded-xl transition-all">UL</button>
                <button onClick={() => execCommand('formatBlock', 'H2')} className="p-3 hover:bg-white rounded-xl font-black text-xs transition-all">H2</button>
                <button onClick={() => execCommand('formatBlock', 'P')} className="p-3 hover:bg-white rounded-xl font-black text-xs transition-all">P</button>
              </div>
              <div 
                id="editor"
                contentEditable
                className="p-10 min-h-[400px] outline-none prose prose-blue max-w-none font-medium text-gray-600"
              ></div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'ĐANG ĐĂNG...' : 'ĐĂNG BÀI NGAY 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManager;
