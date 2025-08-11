import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, QrCode, CreditCard, CheckCircle } from 'lucide-react';

const DonationInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto mt-12 mb-8">
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
            <Smartphone className="w-6 h-6 mr-2 text-orange-500" />
            How to Donate via UPI
          </CardTitle>
          <p className="text-gray-600">Simple steps to make your donation</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Method 1: QR Code */}
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Scan QR Code</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <QrCode className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Click "Support This Organization" to open donation modal</p>
                </div>
                <div className="flex items-start">
                  <Smartphone className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Open any UPI app (PhonePe, Google Pay, Paytm, BHIM)</p>
                </div>
                <div className="flex items-start">
                  <QrCode className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Scan the QR code from your UPI app</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Enter amount and complete payment</p>
                </div>
              </div>
            </div>

            {/* Method 2: UPI ID */}
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Manual Payment</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <CreditCard className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Copy the UPI ID from donation modal</p>
                </div>
                <div className="flex items-start">
                  <Smartphone className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Open your UPI app and select "Send Money"</p>
                </div>
                <div className="flex items-start">
                  <CreditCard className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Enter the copied UPI ID as recipient</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" />
                  <p>Enter donation amount and complete payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Popular UPI Apps */}
          <div className="mt-8 pt-6 border-t border-orange-200">
            <h4 className="text-center text-gray-700 font-medium mb-4">Popular UPI Apps</h4>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 mx-auto border border-gray-200">
                  <span className="font-bold text-purple-600">GPay</span>
                </div>
                <p>Google Pay</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 mx-auto border border-gray-200">
                  <span className="font-bold text-blue-600">₹</span>
                </div>
                <p>PhonePe</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 mx-auto border border-gray-200">
                  <span className="font-bold text-blue-500">PTM</span>
                </div>
                <p>Paytm</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 mx-auto border border-gray-200">
                  <span className="font-bold text-orange-600">🏛</span>
                </div>
                <p>BHIM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationInstructions;