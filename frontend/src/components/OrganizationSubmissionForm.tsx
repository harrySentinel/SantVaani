import React from 'react';
import { Building, ExternalLink, CheckCircle, FileText } from 'lucide-react';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeVloZVTjbX6cAGSg6ky3hsoN9m3JIl4iup5V26Ch7hO3VKMA/viewform?usp=publish-editor';

const OrganizationSubmissionForm = () => {
  const handleOpenForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

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

      <div className="p-8 space-y-6">
        {/* Information Section */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Submit Your Organization Details
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We've partnered with Google Forms to make the submission process easier and more secure.
                Click the button below to fill out the registration form for your organization.
              </p>
              <div className="bg-white p-4 rounded-lg border border-orange-200 mb-4">
                <p className="text-sm text-gray-700 font-medium mb-2">What to prepare:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Organization name and type (Vridh Ashram, Orphanage, Temple, Gaushala, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Contact person details (name, phone, email)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Organization location (city, state, address)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Brief description about your organization and its mission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <button
          onClick={handleOpenForm}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Open Registration Form</span>
        </button>

        {/* What Happens Next */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">What Happens Next?</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">1.</span>
              <span>Fill out the Google Form with accurate information about your organization</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">2.</span>
              <span>Our team will review your submission for authenticity</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">3.</span>
              <span>We may contact you via phone or email for verification</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">4.</span>
              <span>Once approved, your organization will be listed on the donation page</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 font-bold">5.</span>
              <span>Start receiving support from generous donors across India</span>
            </li>
          </ul>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By submitting, you agree that the information provided is accurate and can be verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSubmissionForm;
