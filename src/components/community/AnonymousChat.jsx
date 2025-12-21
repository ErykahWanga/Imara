import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { storage, getAnonymousName, generateAnonymousId } from '../../utils/storage';

const AnonymousCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const communityPosts = storage.get('imara_community_posts') || [];
    setPosts(communityPosts);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: 'post_' + Date.now(),
      content: newPost,
      author: getAnonymousName(),
      authorId: generateAnonymousId(),
      timestamp: new Date().toISOString(),
      replies: []
    };

    const updatedPosts = [post, ...posts];
    storage.set('imara_community_posts', updatedPosts);
    setPosts(updatedPosts);
    setNewPost('');
  };

  const handleReply = (postId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: 'reply_' + Date.now(),
      content: replyText,
      author: getAnonymousName(),
      authorId: generateAnonymousId(),
      timestamp: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, replies: [...post.replies, reply] };
      }
      return post;
    });

    storage.set('imara_community_posts', updatedPosts);
    setPosts(updatedPosts);
    setReplyText('');
    setReplyingTo(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-stone-800">Community Space</h2>
        <p className="text-stone-500 text-sm">Share anonymously. No judgment. Just support.</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800">
          Everyone here is anonymous. Your identity stays private. Share what you need to share.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-stone-100 space-y-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind? Share something you're going through..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors min-h-32 resize-none"
        />
        <button
          onClick={handleCreatePost}
          disabled={!newPost.trim()}
          className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Share anonymously
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No posts yet. Be the first to share.</p>
          </div>
        )}

        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl border-2 border-stone-100 space-y-4">
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
                      onClick={() => handleReply(post.id)}
                      className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                    >
                      Send reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-4 bg-stone-100 text-stone-600 py-2 rounded-lg hover:bg-stone-200 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(post.id)}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnonymousCommunity;