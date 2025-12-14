import React, { useRef, useState } from 'react';
import { Download, Heart, Star, Sparkles, ChevronDown, ChevronUp, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface DivineWelcomeLetterProps {
  userName: string;
  userEmail: string;
  joinDate: string;
  userId?: string;
  onDownloadComplete?: () => void;
}

const DivineWelcomeLetter: React.FC<DivineWelcomeLetterProps> = ({
  userName,
  userEmail,
  joinDate,
  userId,
  onDownloadComplete
}) => {
  const letterRef = useRef<HTMLDivElement>(null);
  const pdfLetterRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadAsPDF = async () => {
    // Always use the hidden PDF version for generation
    const targetElement = pdfLetterRef.current;
    if (!targetElement) return;

    try {
      toast({
        title: "🎨 Creating your divine letter...",
        description: "Please wait while we prepare your beautiful welcome card",
        duration: 3000,
      });

      // Temporarily show the PDF version for generation
      const parentElement = targetElement.parentElement!;
      parentElement.style.display = 'block';
      parentElement.style.position = 'fixed';
      parentElement.style.top = '-9999px';
      parentElement.style.left = '-9999px';
      parentElement.style.width = '794px'; // A4 width at 96 DPI
      parentElement.style.height = 'auto'; // Let content determine height
      parentElement.style.zIndex = '-1';

      targetElement.style.display = 'block';
      targetElement.style.width = '794px';
      targetElement.style.height = 'auto'; // Let content determine height
      targetElement.style.minHeight = '1123px'; // Minimum A4 height

      // Wait for rendering and layout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create canvas from the PDF letter element
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        height: targetElement.scrollHeight, // Capture full scrollable height
        windowHeight: targetElement.scrollHeight
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');

      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;

      // Use full page with minimal margins
      const margins = 5; // 5mm margins on all sides
      const contentWidth = pageWidth - (margins * 2);
      const contentHeight = pageHeight - (margins * 2);

      // Validate canvas dimensions
      if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
        throw new Error('Invalid canvas dimensions');
      }

      // Calculate aspect ratios with safety checks
      const canvasAspectRatio = canvas.width / canvas.height;
      const contentAspectRatio = contentWidth / contentHeight;

      let finalWidth, finalHeight, xOffset, yOffset;

      if (canvasAspectRatio > contentAspectRatio) {
        // Canvas is wider - fit to width
        finalWidth = contentWidth;
        finalHeight = contentWidth / canvasAspectRatio;
        xOffset = margins;
        yOffset = margins + (contentHeight - finalHeight) / 2;
      } else {
        // Canvas is taller - fit to height
        finalHeight = contentHeight;
        finalWidth = contentHeight * canvasAspectRatio;
        xOffset = margins + (contentWidth - finalWidth) / 2;
        yOffset = margins;
      }

      // Ensure coordinates are valid numbers with fallbacks
      if (!isFinite(finalWidth) || finalWidth <= 0) finalWidth = contentWidth;
      if (!isFinite(finalHeight) || finalHeight <= 0) finalHeight = contentHeight;
      if (!isFinite(xOffset) || xOffset < 0) xOffset = margins;
      if (!isFinite(yOffset) || yOffset < 0) yOffset = margins;

      // Add image to PDF with calculated dimensions
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

      // Hide PDF version after generation
      parentElement.style.display = 'none';
      parentElement.style.position = '';
      parentElement.style.top = '';
      parentElement.style.left = '';
      parentElement.style.width = '';
      parentElement.style.height = '';
      parentElement.style.zIndex = '';

      targetElement.style.display = '';
      targetElement.style.width = '';
      targetElement.style.height = '';

      // Save the PDF
      const fileName = `Santvaani_Welcome_${userName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);

      // Update backend that welcome letter was downloaded
      if (userId) {
        try {
          const backendUrl = import.meta.env.MODE === 'development'
            ? 'http://localhost:5000'
            : import.meta.env.VITE_BACKEND_URL || 'https://santvaani-backend.onrender.com';

          const response = await fetch(`${backendUrl}/api/user/profile/${userId}/welcome-letter`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            console.log('Welcome letter download status updated');
            onDownloadComplete?.();
          }
        } catch (error) {
          console.error('Error updating welcome letter status:', error);
        }
      }

      toast({
        title: "✨ Divine Letter Downloaded!",
        description: "Your beautiful welcome letter has been saved to your downloads",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);

      // Hide PDF version even if generation fails
      const parentElement = targetElement.parentElement!;
      parentElement.style.display = 'none';
      parentElement.style.position = '';
      parentElement.style.top = '';
      parentElement.style.left = '';
      parentElement.style.width = '';
      parentElement.style.height = '';
      parentElement.style.zIndex = '';

      targetElement.style.display = '';
      targetElement.style.width = '';
      targetElement.style.height = '';

      toast({
        title: "⚠️ Download Error",
        description: "Failed to generate PDF. Please try again.",
        duration: 4000,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Expand/Collapse Controls */}
      <div className="mb-4 md:mb-6 text-center space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base w-full sm:w-auto"
          >
            {isExpanded ? <Minimize className="w-4 h-4 mr-1 md:mr-2" /> : <Maximize className="w-4 h-4 mr-1 md:mr-2" />}
            {isExpanded ? 'Collapse Letter' : 'Expand Letter'}
            {isExpanded ? <ChevronUp className="w-3 h-3 ml-1 md:ml-2" /> : <ChevronDown className="w-3 h-3 ml-1 md:ml-2" />}
          </Button>

          <Button
            onClick={downloadAsPDF}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Download Divine Welcome Letter</span>
            <span className="sm:hidden">Download Letter</span>
          </Button>
        </div>

        {!isExpanded && (
          <p className="text-gray-600 text-sm">
            Click "Expand Letter" to view your beautiful divine welcome message in full ✨
          </p>
        )}
      </div>

      {/* Desktop Welcome Letter */}
      <div className={`desktop-letter hidden md:block transition-all duration-500 ${isExpanded ? 'opacity-100 max-h-none' : 'opacity-75 max-h-96 overflow-hidden'}`}>
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div
              ref={letterRef}
              className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 p-8 w-full min-h-[700px] aspect-[210/297]"
              style={{
                width: '100%',
                maxWidth: '100%'
              }}
            >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-2 md:top-8 left-2 md:left-8">
                <Star className="w-8 h-8 md:w-16 md:h-16 text-orange-500" />
              </div>
              <div className="absolute top-2 md:top-8 right-2 md:right-8">
                <Sparkles className="w-8 h-8 md:w-16 md:h-16 text-red-500" />
              </div>
              <div className="absolute bottom-2 md:bottom-8 left-2 md:left-8">
                <Heart className="w-8 h-8 md:w-16 md:h-16 text-orange-500" />
              </div>
              <div className="absolute bottom-2 md:bottom-8 right-2 md:right-8">
                <Star className="w-8 h-8 md:w-16 md:h-16 text-red-500" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-orange-700 mb-2">
                Santvaani Digital Ashram
              </h1>
              <p className="text-lg text-gray-600 font-medium">Divine Welcome Letter</p>
            </div>

            {/* Main Content - Heartfelt Welcome Message */}
            <div className="flex-1 flex flex-col justify-center text-center space-y-8 px-4">

              {/* Beautiful Heart Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Personal Welcome */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-orange-700">
                  Dear {userName} 💫
                </h2>
                <p className="text-lg md:text-2xl text-gray-700 font-medium leading-relaxed">
                  Welcome to the Santvaani Family!
                </p>
              </div>

              {/* Heartfelt Message */}
              <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto px-2 md:px-0">
                <p className="text-base md:text-xl text-gray-700 leading-relaxed">
                  From the bottom of our hearts, we want you to know how blessed we feel to have you join our spiritual community. Your decision to be part of Santvaani fills us with immense joy and gratitude.
                </p>

                <p className="text-base md:text-xl text-gray-700 leading-relaxed">
                  You are not just a member - you are family. Together, we will walk the beautiful path of spirituality, sharing moments of divine connection, ancient wisdom, and inner peace.
                </p>

                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 md:p-8 rounded-3xl mx-2 md:mx-0">
                  <p className="text-lg md:text-2xl font-semibold text-orange-800 italic mb-2 md:mb-4">
                    "Your presence lights up our digital ashram"
                  </p>
                  <p className="text-sm md:text-lg text-gray-700">
                    Every soul that joins us makes our community more vibrant, more loving, and more divine. Thank you for choosing to grow with us.
                  </p>
                </div>

                <p className="text-base md:text-xl text-orange-700 font-semibold">
                  May your journey with us be filled with endless blessings, profound peace, and beautiful discoveries about yourself and the divine within.
                </p>
              </div>

              {/* Warm Closing */}
              <div className="space-y-3">
                <p className="text-xl md:text-3xl font-bold text-orange-700">
                  Welcome Home, Beautiful Soul! 🌸
                </p>
                <p className="text-base md:text-xl text-gray-600">
                  With infinite love and warmest wishes
                </p>
                <p className="text-sm md:text-lg text-orange-600 font-semibold">
                  The Santvaani Family ❤️
                </p>
              </div>
            </div>


            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-orange-200 rounded-lg pointer-events-none opacity-30"></div>

            {/* Fade overlay when collapsed */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expand hint when collapsed */}
      {!isExpanded && (
        <div className="text-center mt-4">
          <Button
            onClick={() => setIsExpanded(true)}
            variant="ghost"
            className="text-orange-600 hover:text-orange-700 text-sm animate-pulse"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            Click to read your complete divine message
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>

      {/* Mobile Welcome Letter */}
      <div className={`mobile-letter md:hidden transition-all duration-500 ${isExpanded ? 'opacity-100 max-h-none' : 'opacity-75 max-h-64 overflow-hidden'}`}>
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 p-6 w-full">

              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-lg font-bold text-orange-700 mb-1">
                  Santvaani Digital Ashram
                </h1>
                <p className="text-sm text-gray-600 font-medium">Divine Welcome Letter</p>
              </div>

              {/* Heart Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Compact Welcome */}
              <div className="text-center space-y-3">
                <h2 className="text-xl font-bold text-orange-700">
                  Dear {userName} 💫
                </h2>
                <p className="text-lg text-gray-700 font-medium">
                  Welcome to the Santvaani Family!
                </p>

                <p className="text-sm text-gray-700 leading-relaxed px-2">
                  From the bottom of our hearts, we want you to know how blessed we feel to have you join our spiritual community. You are not just a member - you are family.
                </p>

                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-2xl mx-2">
                  <p className="text-base font-semibold text-orange-800 italic mb-2">
                    "Your presence lights up our digital ashram"
                  </p>
                  <p className="text-xs text-gray-700">
                    Thank you for choosing to grow with us.
                  </p>
                </div>

                <p className="text-sm text-orange-700 font-semibold px-2">
                  May your journey with us be filled with endless blessings and profound peace.
                </p>

                <p className="text-lg font-bold text-orange-700 mt-4">
                  Welcome Home, Beautiful Soul! 🌸
                </p>
                <p className="text-sm text-gray-600">
                  With infinite love - The Santvaani Family ❤️
                </p>
              </div>


              {/* Fade overlay when collapsed */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile expand hint when collapsed */}
        {!isExpanded && (
          <div className="text-center mt-3">
            <Button
              onClick={() => setIsExpanded(true)}
              variant="ghost"
              className="text-orange-600 hover:text-orange-700 text-xs animate-pulse"
            >
              <ChevronDown className="w-3 h-3 mr-1" />
              Tap to read complete message
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Hidden PDF Version - Always uses desktop layout at A4 width for consistent format across all devices */}
      <div style={{ display: 'none' }}>
        <div
          ref={pdfLetterRef}
          className="relative bg-white p-8 w-full"
          style={{
            width: '794px', // A4 width at 96 DPI
            minHeight: '1000px', // Adjusted height since content is shorter
            paddingBottom: '40px' // Reduced padding since no footer
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-8 left-8">
              <Star className="w-16 h-16 text-orange-500" />
            </div>
            <div className="absolute top-8 right-8">
              <Sparkles className="w-16 h-16 text-red-500" />
            </div>
            <div className="absolute bottom-8 left-8">
              <Heart className="w-16 h-16 text-orange-500" />
            </div>
            <div className="absolute bottom-8 right-8">
              <Star className="w-16 h-16 text-red-500" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-orange-700 mb-2">
              Santvaani Digital Ashram
            </h1>
            <p className="text-lg text-gray-600 font-medium">Divine Welcome Letter</p>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center text-center space-y-10 px-8">
            {/* Heart Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Personal Welcome */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-orange-700">
                Dear {userName} 💫
              </h2>
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">
                Welcome to the Santvaani Family!
              </p>
            </div>

            {/* Heartfelt Message */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed">
                From the bottom of our hearts, we want you to know how blessed we feel to have you join our spiritual community. Your decision to be part of Santvaani fills us with immense joy and gratitude.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed">
                You are not just a member - you are family. Together, we will walk the beautiful path of spirituality, sharing moments of divine connection, ancient wisdom, and inner peace.
              </p>

              <div className="bg-orange-100 p-8 rounded-3xl">
                <p className="text-2xl font-semibold text-orange-800 italic mb-4">
                  "Your presence lights up our digital ashram"
                </p>
                <p className="text-lg text-gray-700">
                  Every soul that joins us makes our community more vibrant, more loving, and more divine. Thank you for choosing to grow with us.
                </p>
              </div>

              <p className="text-xl text-orange-700 font-semibold">
                May your journey with us be filled with endless blessings, profound peace, and beautiful discoveries about yourself and the divine within.
              </p>
            </div>

            {/* Warm Closing */}
            <div className="space-y-3">
              <p className="text-3xl font-bold text-orange-700">
                Welcome Home, Beautiful Soul! 🌸
              </p>
              <p className="text-xl text-gray-600">
                With infinite love and warmest wishes
              </p>
              <p className="text-lg text-orange-600 font-semibold">
                The Santvaani Family ❤️
              </p>
            </div>
          </div>


          {/* Decorative Border */}
          <div className="absolute inset-4 border-4 border-orange-200 rounded-lg pointer-events-none opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default DivineWelcomeLetter;