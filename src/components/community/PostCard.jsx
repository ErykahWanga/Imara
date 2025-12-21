import React from 'react';
import { User } from 'lucide-react';

const PostCard = ({ post, formatTime, replyingTo, replyText, setReplyText, onReply, onStartReply }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-stone-100 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">{post.author}</p>
            <p className="text-xs text-stone-400">{formatTime(post.timestamp)}</p>
          </div>
        </div>
      </div>

      <p className="text-stone-700 leading-relaxed">{post.content}</p>

      <div className="pt-2 border-t border-stone-100">
        {post.replies.length > 0 && (
          <div className="space-y-3 mb-4">
            {post.replies.map((reply) => (
              <div key={reply.id} className="pl-4 border-l-2 border-stone-200 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-stone-600">{reply.author}</p>
                  <p className="text-xs text-stone-400">{formatTime(reply.timestamp)}</p>
                </div>
                <p className="text-sm text-stone-700">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {replyingTo === post.id ? (
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
                onClick={() => onReply(post.id)}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Send reply
              </button>
              <button
                onClick={() => {
                  onStartReply(null);
                }}
                className="px-4 bg-stone-100 text-stone-600 py-2 rounded-lg hover:bg-stone-200 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onStartReply(post.id)}
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            Reply
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;