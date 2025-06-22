
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Sparkles, Book, ArrowDown } from 'lucide-react';
import ChatBot from '@/components/chatBot';

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Great Saints",
      titleHi: "महान संत",
      description: "Discover the life stories and teachings of legendary saints like Meera Bai, Kabir Das, and Tulsidas",
      descriptionHi: "मीरा बाई, कबीर दास और तुलसीदास जैसे महान संतों की जीवन गाथा और शिक्षाओं की खोज करें",
      to: "/saints",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      title: "Living Saints",
      titleHi: "जीवित संत",
      description: "Connect with contemporary spiritual masters who continue to spread divine wisdom",
      descriptionHi: "समकालीन आध्यात्मिक गुरुओं से जुड़ें जो दिव्य ज्ञान फैलाना जारी रखते हैं",
      to: "/living-saints",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Sparkles,
      title: "Divine Forms",
      titleHi: "दिव्य रूप",
      description: "Explore the sacred forms of the divine and understand their deeper meanings",
      descriptionHi: "परमात्मा के पवित्र रूपों की खोज करें और उनके गहरे अर्थों को समझें",
      to: "/divine",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Book,
      title: "Bhajans & Quotes",
      titleHi: "भजन और उद्धरण",
      description: "Immerse yourself in devotional songs and inspiring spiritual quotes",
      descriptionHi: "भक्ति गीतों और प्रेरणादायक आध्यात्मिक उद्धरणों में खुद को डुबोएं",
      to: "/bhajans",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Sacred Wisdom
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Journey through the rich spiritual heritage of India through our carefully curated collection of saints, teachings, and divine forms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.to}>
                  <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowDown className="w-5 h-5 text-orange-500 mx-auto transform rotate-[-90deg]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Our Sacred Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                SantVaani is dedicated to preserving and sharing the timeless wisdom of India's greatest spiritual masters. 
                We believe that in today's fast-paced world, the teachings of these enlightened souls can provide guidance, 
                peace, and direction to seekers on their spiritual journey.
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
                "जहाँ भक्ति है, वहाँ शक्ति है"
              </blockquote>
              <p className="text-lg text-orange-600 mt-2">
                "Where there is devotion, there is divine power"
              </p>
            </div>

            <Link to="/about">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full mt-5"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ChatBot />
      <Footer />
    </div>
  );
};

export default Index;
