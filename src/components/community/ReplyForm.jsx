import React from 'react';

const ReplyForm = ({ replyText, setReplyText, onReply, onCancel }) => {
  return (
    <div className="space-y-2">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a supportive reply..."
        className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors text-sm resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          onClick={onReply}
          className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
        >
          Send reply
        </button>
        <button
          onClick={onCancel}
          className="px-4 bg-stone-100 text-stone-600 py-2 rounded-lg hover:bg-stone-200 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReplyForm;