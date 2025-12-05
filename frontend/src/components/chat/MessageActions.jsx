import React, { useState } from 'react';
import { RotateCcw, MessageCircle, Copy, CheckCircle } from 'lucide-react';

const MessageActions = ({ message, onRegenerate, onFollowUp }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role !== 'assistant') return null;

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
      <button
        onClick={onRegenerate}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        重新生成
      </button>
      
      <button
        onClick={onFollowUp}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        追问
      </button>
      
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        {copied ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            已复制
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            复制
          </>
        )}
      </button>
    </div>
  );
};

export default MessageActions;
