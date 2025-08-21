import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackForm = ({ isOpen, onClose }: FeedbackFormProps) => {
  // Replace this URL with your actual Google Form URL
  const GOOGLE_FORM_URL = 'https://forms.gle/your-form-id-here';

  const handleOpenGoogleForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
    onClose();
  };

  return (
    <>
      {/* Feedback Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Share Your Feedback</h2>
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

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">🙏</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Help Us Serve Better
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your thoughts and suggestions are invaluable to us. Click below to share your feedback through our secure Google Form.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleOpenGoogleForm}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Feedback Form</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 rounded-b-2xl">
              <p className="text-xs text-gray-500 text-center">
                🔒 Your feedback is securely collected through Google Forms
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;