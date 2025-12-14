import React, { useState } from 'react';
import { Building, Phone, Mail, MapPin, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const OrganizationSubmissionForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'vridh_ashram',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const organizationTypes = [
    { value: 'vridh_ashram', label: 'Vridh Ashram (Old Age Home)', icon: '🏡' },
    { value: 'orphanage', label: 'Orphanage', icon: '👶' },
    { value: 'dharamshala', label: 'Dharamshala', icon: '🏛️' },
    { value: 'temple', label: 'Temple Trust', icon: '🕉️' },
    { value: 'gaushala', label: 'Gaushala', icon: '🐄' },
    { value: 'other', label: 'Other Religious Organization', icon: '🙏' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/organizations/submit`, formData);

      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          organizationName: '',
          organizationType: 'vridh_ashram',
          contactPerson: '',
          phone: '',
          email: '',
          city: '',
          state: '',
          description: ''
        });
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Submission Received!</h3>
        <p className="text-green-700 mb-4 text-lg">
          Thank you for registering your organization with Santvaani.
        </p>
        <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm mb-6">
          <p className="text-sm text-gray-700 mb-4">
            <strong className="text-green-700">What happens next?</strong>
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Our team will review your submission within 2-3 business days</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>We may contact you via phone or email for verification</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Once approved, your organization will be listed on the donation page</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>You'll receive an email confirmation when your listing goes live</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 text-green-700 hover:text-green-800 font-medium transition-colors"
        >
          Submit Another Organization
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white p-8">
        <div className="flex items-center space-x-3 mb-2">
          <Building className="w-8 h-8" />
          <h2 className="text-3xl font-bold">List Your Organization</h2>
        </div>
        <p className="text-orange-100 text-lg">
          Get listed on Santvaani and receive donations from caring hearts
        </p>
      </div>

      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Submission Failed</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Organization Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <Building className="w-5 h-5 text-orange-600" />
            <span>Organization Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Name of your organization"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type <span className="text-red-500">*</span>
              </label>
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                required
              >
                {organizationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-orange-600" />
            <span>Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Location</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="City name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="State name"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">About Your Organization</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brief Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="Tell us about your organization, the people you serve, and how donations will help (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us understand your mission better
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit for Review</span>
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            By submitting, you agree that the information provided is accurate and can be verified
          </p>
        </div>
      </form>
    </div>
  );
};

export default OrganizationSubmissionForm;
