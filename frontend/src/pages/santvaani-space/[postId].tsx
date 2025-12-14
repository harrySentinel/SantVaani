import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Loader2, Calendar, Tag, Share2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import LikeButton from '@/components/santvaani-space/LikeButton';
import CommentSection from '@/components/santvaani-space/CommentSection';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SpiritualPost {
  id: string;
  title: string;
  title_hi: string | null;
  content: string;
  content_hi: string | null;
  image_url: string | null;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [post, setPost] = useState<SpiritualPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchPost();
    // Get user ID from localStorage/auth context
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      checkLikeStatus(storedUserId);
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/santvaani-space/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'पोस्ट लोड करने में विफल' : 'Failed to load post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async (uid: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/santvaani-space/posts/${postId}/liked?userId=${uid}`
      );
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post?.title || 'Santvaani Space',
      text: post?.content?.substring(0, 100) + '...' || '',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: language === 'hi' ? 'साझा किया गया' : 'Shared',
          description: language === 'hi' ? 'पोस्ट सफलतापूर्वक साझा किया गया' : 'Post shared successfully'
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: language === 'hi' ? 'लिंक कॉपी किया गया' : 'Link Copied',
        description: language === 'hi' ? 'लिंक क्लिपबोर्ड पर कॉपी किया गया' : 'Link copied to clipboard'
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {language === 'hi' ? 'पोस्ट नहीं मिला' : 'Post not found'}
          </p>
          <button
            onClick={() => navigate('/santvaani-space')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
          >
            {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  const title = language === 'hi' && post.title_hi ? post.title_hi : post.title;
  const content = language === 'hi' && post.content_hi ? post.content_hi : post.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Toaster />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/santvaani-space')}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">
              {language === 'hi' ? 'वापस जाएं' : 'Back to Feed'}
            </span>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Post Image */}
          {post.image_url && (
            <div className="relative w-full h-96 overflow-hidden">
              <img
                src={post.image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Details */}
          <div className="p-6 md:p-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-purple-100 text-orange-800 font-medium">
                <Tag className="h-3 w-3 mr-1" />
                {post.category}
              </span>
              <span className="inline-flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.created_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <LikeButton
                postId={post.id}
                initialLikes={post.likes_count}
                initialLiked={liked}
                userId={userId}
              />

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {language === 'hi' ? 'साझा करें' : 'Share'}
                </span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection postId={post.id} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
