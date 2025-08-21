import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CopyButton, QuickCopyButton } from '@/components/ui/copy-button';

const CopyDemo = () => {
  const sampleQuote = {
    text: "The only way to find yourself is to lose yourself in the service of others",
    text_hi: "अपने आप को खोजने का एकमात्र तरीका दूसरों की सेवा में अपने आप को खो देना है",
    author: "Mahatma Gandhi",
    category: "Service"
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Copy Functionality Demo</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quote Card Demo */}
        <Card className="group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                {sampleQuote.category}
              </span>
              <QuickCopyButton 
                text={sampleQuote.text}
                author={sampleQuote.author}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            <blockquote className="text-lg text-gray-700 leading-relaxed italic">
              "{sampleQuote.text}"
            </blockquote>
            
            <p className="text-base text-orange-600 font-medium">
              "{sampleQuote.text_hi}"
            </p>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">- {sampleQuote.author}</p>
              <CopyButton
                text={sampleQuote.text}
                textHi={sampleQuote.text_hi}
                author={sampleQuote.author}
                category={sampleQuote.category}
                variant="ghost"
                size="sm"
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Button Variations */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Button Variations</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Default Copy Button:</p>
                <CopyButton
                  text={sampleQuote.text}
                  textHi={sampleQuote.text_hi}
                  author={sampleQuote.author}
                  category={sampleQuote.category}
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Outline Variant:</p>
                <CopyButton
                  text={sampleQuote.text}
                  author={sampleQuote.author}
                  variant="outline"
                  size="default"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick Copy Button:</p>
                <QuickCopyButton
                  text={sampleQuote.text}
                  author={sampleQuote.author}
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Simple Text Copy:</p>
                <CopyButton
                  text={sampleQuote.text}
                  author={sampleQuote.author}
                  type="simple"
                  variant="secondary"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-600">
          📱 On mobile: Shows "Share" button for easy sharing via WhatsApp, SMS, etc.
        </p>
        <p className="text-gray-600">
          💻 On desktop: Shows "Copy" button for clipboard functionality
        </p>
        <p className="text-sm text-gray-500">
          Try hovering over the quote card to see the copy buttons appear!
        </p>
      </div>
    </div>
  );
};

export default CopyDemo;