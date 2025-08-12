import React, { useState } from 'react';
import { MessageSquare, Send, Star, Heart, Lightbulb } from 'lucide-react';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackForm = ({ isOpen, onClose }: FeedbackFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: 5,
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: 'general', label: 'General Feedback', icon: '💭' },
    { value: 'content', label: 'Content Suggestions', icon: '📚' },
    { value: 'features', label: 'New Features', icon: '⭐' },
    { value: 'spiritual', label: 'Spiritual Experience', icon: '🙏' },
    { value: 'technical', label: 'Technical Issues', icon: '🔧' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, just log the feedback (replace with EmailJS when configured)
      console.log('Feedback submitted:', formData);
      
      // TODO: Uncomment when EmailJS is configured
      // const success = await sendFeedback(formData);
      // if (!success) {
      //   throw new Error('Failed to send feedback');
      // }
      
      // Simulate delay for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      
      // Reset form after showing success
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          feedback: '',
          rating: 5,
          category: 'general'
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Sorry, there was an error sending your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg max-w-sm">
          <div className="text-center">
            <div className="text-4xl mb-2">🙏</div>
            <h3 className="text-green-800 font-semibold mb-1">Thank You!</h3>
            <p className="text-green-600 text-sm">Your feedback helps us serve devotees better</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* Feedback Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Help Us Improve</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-orange-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-orange-100 text-sm mt-2">
                Your feedback helps us create a better spiritual experience for all devotees
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Experience
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`p-1 transition-colors ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Share your thoughts, suggestions, or how we can improve SantVaani..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 rounded-b-2xl">
              <p className="text-xs text-gray-500 text-center">
                🙏 Your feedback is valuable to us and helps improve the spiritual journey for all
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;