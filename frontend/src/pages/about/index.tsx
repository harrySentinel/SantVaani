
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Globe, Users, BookOpen, Lightbulb, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  const values = [
    {
      icon: Heart,
      title: "Love & Devotion",
      titleHi: "प्रेम और भक्ति",
      description: "We believe that love is the highest path to divine realization and the foundation of all spiritual practice."
    },
    {
      icon: Globe,
      title: "Universal Wisdom",
      titleHi: "सार्वभौमिक ज्ञान",
      description: "Sharing the timeless teachings that transcend boundaries and speak to the universal human experience."
    },
    {
      icon: Users,
      title: "Community",
      titleHi: "समुदाय",
      description: "Building a global community of spiritual seekers united in their quest for truth and enlightenment."
    },
    {
      icon: BookOpen,
      title: "Preservation",
      titleHi: "संरक्षण",
      description: "Preserving and protecting the sacred wisdom of our saints for future generations."
    }
  ];

  const team = [
    {
      name: "Aditya Srivastava",
      title: "Founder & Developer",
      role: "Devotee & Software Engineer building spiritual technology to serve humanity",
      image: "/profie.jpg"
    },
    {
      name: "Neeraj Yadav",
      title: "Co-Founder & Developer",
      role: "Spiritual developer and tech visionary dedicated to building divine technology solutions",
      image: "/founder2.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-blue-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-3xl">🕉️</span>
              <Heart className="w-8 h-8 text-blue-500 animate-pulse" />
              <span className="text-3xl">📿</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              {language === 'hi' ? 'संतवाणी के बारे में' : 'About SantVaani'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'hi'
                ? 'भारत के महान आध्यात्मिक गुरुओं के गहन ज्ञान को संरक्षित करने और दुनिया भर के साधकों के साथ साझा करने के लिए समर्पित एक डिजिटल अभयारण्य।'
                : 'A digital sanctuary dedicated to preserving and sharing the profound wisdom of India\'s greatest spiritual masters with seekers around the world.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h2 className="text-3xl font-bold text-gray-800">
                    {language === 'hi' ? 'हमारा लक्ष्य' : 'Our Mission'}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {language === 'hi'
                    ? 'संतवाणी का जन्म भारत की आध्यात्मिक विरासत के प्रति गहरी श्रद्धा और इन कालातीत शिक्षाओं को आधुनिक साधकों के लिए सुलभ बनाने की इच्छा से हुआ। हम मानते हैं कि आज की तेज़-तर्रार दुनिया में, हमारे संतों का ज्ञान मार्गदर्शन, शांति और दिशा प्रदान कर सकता है।'
                    : 'SantVaani was born from a deep reverence for the spiritual heritage of India and a desire to make these timeless teachings accessible to modern seekers. We believe that in today\'s fast-paced world, the wisdom of our saints can provide guidance, peace, and direction.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {language === 'hi' ? 'हमारी दृष्टि' : 'Our Vision'}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'hi'
                    ? 'एक वैश्विक समुदाय बनाना जहां आध्यात्मिक ज्ञान स्वतंत्र रूप से बहे, जहां साधक प्रामाणिक शिक्षाएं पा सकें, और जहां हमारे संतों का दिव्य प्रेम संस्कृति, भाषा और भूगोल की सभी सीमाओं को पार करते हुए हृदयों को परिवर्तित करता रहे।'
                    : 'To create a global community where spiritual wisdom flows freely, where seekers can find authentic teachings, and where the divine love of our saints continues to transform hearts across all boundaries of culture, language, and geography.'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6 border border-blue-200">
                <blockquote className="text-lg text-gray-700 italic font-medium leading-relaxed">
                  "वसुधैव कुटुम्बकम्"
                </blockquote>
                <p className="text-blue-600 mt-2">
                  "The world is one family" - Our guiding principle
                </p>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                alt="Spiritual meditation"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-medium">Connecting hearts to divine wisdom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? 'हमारे मूल मूल्य' : 'Our Core Values'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'वे सिद्धांत जो हमारे काम का मार्गदर्शन करते हैं और आध्यात्मिक ज्ञान की प्रामाणिक अभिव्यक्ति सुनिश्चित करते हैं'
                : 'The principles that guide our work and ensure authentic representation of spiritual wisdom'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800">
                      {language === 'hi' ? value.titleHi : value.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? 'टीम से मिलें' : 'Meet the Team'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'संतवाणी एक समर्पित टीम द्वारा बनाई गई है जो आध्यात्मिक ज्ञान के प्रामाणिक संरक्षण और साझाकरण को सुनिश्चित करने के लिए श्रद्धा के साथ काम कर रही है।'
                : 'SantVaani is built by a dedicated team working with reverence to ensure the authentic preservation and sharing of spiritual wisdom.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300 border-4 border-gradient-to-br from-blue-200 to-orange-200"
                  />

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {member.title}
                    </p>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {language === 'hi' ? 'हमारी आध्यात्मिक यात्रा में शामिल हों' : 'Join Our Spiritual Journey'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {language === 'hi'
                ? 'चाहे आप अपने आध्यात्मिक पथ की शुरुआत कर रहे हों या अपने अभ्यास को गहरा कर रहे हों, संतवाणी आपका स्वागत करता है अन्वेषण, सीखने और बढ़ने के लिए। साथ मिलकर, हम आने वाली पीढ़ियों के लिए दिव्य ज्ञान की ज्योति को उज्ज्वल रख सकते हैं।'
                : 'Whether you are beginning your spiritual path or deepening your practice, SantVaani welcomes you to explore, learn, and grow. Together, we can keep the flame of divine wisdom burning bright for generations to come.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Learn</span>
              </h3>
              <p className="text-sm text-gray-600">Discover authentic teachings from great saints</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span>Connect</span>
              </h3>
              <p className="text-sm text-gray-600">Join a community of like-minded seekers</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-2xl p-8 border border-blue-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "सत्संग से ही सत्य की प्राप्ति होती है"
            </blockquote>
            <p className="text-blue-600 mt-2 text-lg">
              "Truth is attained only through the company of the wise"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Start Your Journey
            </a>
            <a href="/bhajans" className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
              Explore Bhajans
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
