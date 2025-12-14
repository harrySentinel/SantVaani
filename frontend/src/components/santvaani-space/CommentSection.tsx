import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Trash2, Loader2, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

interface CommentSectionProps {
  postId: string;
  userId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, userId }) => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/santvaani-space/posts/${postId}/comments`
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: language === 'hi' ? 'साइन इन करें' : 'Sign In Required',
        description: language === 'hi'
          ? 'टिप्पणी करने के लिए कृपया साइन इन करें'
          : 'Please sign in to comment',
        variant: 'destructive'
      });
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_URL}/api/santvaani-space/posts/${postId}/comments`,
        {
          userId,
          userName: language === 'hi' ? 'संतवाणी उपयोगकर्ता' : 'Santvaani User',
          comment: newComment.trim()
        }
      );

      setComments(prev => [response.data, ...prev]);
      setNewComment('');

      toast({
        title: language === 'hi' ? 'सफलता' : 'Success',
        description: language === 'hi'
          ? 'टिप्पणी जोड़ी गई'
          : 'Comment added successfully'
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi'
          ? 'टिप्पणी जोड़ने में विफल'
          : 'Failed to add comment',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!userId) return;

    try {
      await axios.delete(
        `${API_URL}/api/santvaani-space/posts/${postId}/comments/${commentId}`,
        {
          data: { userId }
        }
      );

      setComments(prev => prev.filter(c => c.id !== commentId));

      toast({
        title: language === 'hi' ? 'सफलता' : 'Success',
        description: language === 'hi'
          ? 'टिप्पणी हटाई गई'
          : 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi'
          ? 'टिप्पणी हटाने में विफल'
          : 'Failed to delete comment',
        variant: 'destructive'
      });
    }
  };

  const formatCommentTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'hi' ? 'टिप्पणियाँ' : 'Comments'}
        </h2>
        <span className="text-gray-500">({comments.length})</span>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="space-y-4">
          {/* Comment Input */}
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'अपनी टिप्पणी लिखें...'
                  : 'Write your comment...'
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{language === 'hi' ? 'भेजा जा रहा है...' : 'Posting...'}</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>{language === 'hi' ? 'टिप्पणी करें' : 'Post Comment'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {language === 'hi'
            ? 'अभी तक कोई टिप्पणी नहीं। पहली टिप्पणी करें!'
            : 'No comments yet. Be the first to comment!'}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center text-white">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.user_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatCommentTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button (only for comment owner) */}
                  {userId === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex-shrink-0 ml-2 text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title={language === 'hi' ? 'हटाएं' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
