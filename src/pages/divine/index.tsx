import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DivineFormModal from '@/components/DivineFormModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Shield, Zap } from 'lucide-react';

const Divine = () => {
  const [selectedDivineForm, setSelectedDivineForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDivineFormClick = (form) => {
    setSelectedDivineForm(form);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDivineForm(null);
  };

  const divineforms = [
    {
      id: 1,
      name: "Thakur Ji (Krishna)",
      nameHi: "ठाकुर जी (कृष्ण)",
      symbol: "🦚",
      domain: "Love & Compassion",
      domainHi: "प्रेम और करुणा",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop",
      description: "The supreme deity of love, known for his playful nature and divine wisdom. Krishna represents the perfect balance of divine love and cosmic consciousness.",
      descriptionHi: "प्रेम के सर्वोच्च देवता, अपनी मनमोहक प्रकृति और दिव्य ज्ञान के लिए प्रसिद्ध। कृष्ण दिव्य प्रेम और ब्रह्मांडीय चेतना के पूर्ण संतुलन का प्रतिनिधित्व करते हैं।",
      attributes: ["Divine Love", "Wisdom", "Protection", "Leela (Divine Play)"],
      mantra: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
      significance: "Represents the ultimate reality and divine consciousness accessible through pure love and devotion."
    },
    {
      id: 2,
      name: "Khatu Shyam Ji",
      nameHi: "खाटू श्याम जी",
      symbol: "🚩",
      domain: "Justice & Valor",
      domainHi: "न्याय और वीरता",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "A form of Krishna known for his supreme sacrifice and unwavering devotion to dharma. Worshipped for justice and protection of the righteous.",
      descriptionHi: "कृष्ण का एक रूप जो अपने सर्वोच्च बलिदान और धर्म के प्रति अटूट समर्पण के लिए प्रसिद्ध है। न्याय और धर्मियों की सुरक्षा के लिए पूजे जाते हैं।",
      attributes: ["Sacrifice", "Justice", "Valor", "Protection"],
      mantra: "श्री खाटू श्याम जी की जय",
      significance: "Teaches the value of supreme sacrifice for righteousness and protection of dharma."
    },
    {
      id: 3,
      name: "Hanuman Ji",
      nameHi: "हनुमान जी",
      symbol: "🔥",
      domain: "Strength & Devotion",
      domainHi: "शक्ति और भक्ति",
      image: "https://images.unsplash.com/photo-1582896911227-c966f6b06bdc?w=400&h=400&fit=crop",
      description: "The mighty devotee of Lord Rama, symbolizing unwavering faith, courage, and selfless service. Hanuman represents the power of true devotion.",
      descriptionHi: "भगवान राम के महान भक्त, अटूट विश्वास, साहस और निस्वार्थ सेवा के प्रतीक। हनुमान सच्ची भक्ति की शक्ति का प्रतिनिधित्व करते हैं।",
      attributes: ["Strength", "Devotion", "Courage", "Service"],
      mantra: "हनुमान चालीसा",
      significance: "Embodies the power of devotion and shows how surrender to the divine grants infinite strength."
    },
    {
      id: 4,
      name: "Ganesha",
      nameHi: "गणेश",
      symbol: "🐘",
      domain: "Wisdom & New Beginnings",
      domainHi: "बुद्धि और नई शुरुआत",
      image: "https://images.unsplash.com/photo-1565193566173-7a0691aa3a2e?w=400&h=400&fit=crop",
      description: "The remover of obstacles and patron of arts and sciences. Ganesha blesses new ventures and grants wisdom to overcome challenges.",
      descriptionHi: "विघ्न हर्ता और कला तथा विज्ञान के संरक्षक। गणेश नए उपक्रमों को आशीर्वाद देते हैं और चुनौतियों पर काबू पाने के लिए बुद्धि प्रदान करते हैं।",
      attributes: ["Wisdom", "Obstacle Removal", "New Beginnings", "Prosperity"],
      mantra: "ॐ गं गणपतये नमः",
      significance: "Teaches that wisdom and humility can overcome any obstacle in the spiritual and material journey."
    },
    {
      id: 5,
      name: "Shiva",
      nameHi: "शिव",
      symbol: "🔱",
      domain: "Transformation & Liberation",
      domainHi: "परिवर्तन और मुक्ति",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop",
      description: "The supreme destroyer and transformer, representing the cycle of creation, preservation, and destruction. Shiva embodies pure consciousness.",
      descriptionHi: "सर्वोच्च संहारक और परिवर्तनकर्ता, सृष्टि, पालन और संहार के चक्र का प्रतिनिधित्व करते हैं। शिव शुद्ध चेतना के प्रतीक हैं।",
      attributes: ["Transformation", "Meditation", "Cosmic Dance", "Liberation"],
      mantra: "ॐ नमः शिवाय",
      significance: "Represents the ultimate reality beyond form and the path to self-realization through meditation."
    },
    {
      id: 6,
      name: "Radha Rani",
      nameHi: "राधा रानी",
      symbol: "🌹",
      domain: "Divine Love & Grace",
      domainHi: "दिव्य प्रेम और कृपा",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "The supreme devotee and beloved of Krishna, representing the soul's love for the divine. Radha embodies pure, selfless love.",
      descriptionHi: "कृष्ण की सर्वोच्च भक्त और प्रिया, परमात्मा के लिए आत्मा के प्रेम का प्रतिनिधित्व करती हैं। राधा शुद्ध, निस्वार्थ प्रेम की मूर्ति हैं।",
      attributes: ["Divine Love", "Devotion", "Grace", "Compassion"],
      mantra: "राधे राधे",
      significance: "Shows the path of love and devotion as the highest form of spiritual practice and union with the divine."
    }
  ];

  const getIconForDomain = (domain: string) => {
    if (domain.includes('Love') || domain.includes('Grace')) return Sparkles;
    if (domain.includes('Justice') || domain.includes('Wisdom')) return Crown;
    if (domain.includes('Strength') || domain.includes('Protection')) return Shield;
    return Zap;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-purple-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-3xl">🕉️</span>
              <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
              <span className="text-3xl">🔱</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Divine Forms
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore the sacred manifestations of the divine and understand the profound meanings 
              behind each form that has guided humanity for millennia.
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-2">
                {divineforms.length} Sacred Forms
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Divine Forms Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {divineforms.map((form) => {
              const DomainIcon = getIconForDomain(form.domain);
              return (
                <Card 
                  key={form.id} 
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                  onClick={() => handleDivineFormClick(form)}
                >
                  <div className="relative">
                    <img 
                      src={form.image} 
                      alt={form.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 rounded-full p-2">
                        <span className="text-2xl">{form.symbol}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-2 text-white">
                        <DomainIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">{form.domain}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {form.name}
                      </h3>
                      <p className="text-sm text-purple-600 font-medium">
                        {form.nameHi}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <DomainIcon className="w-4 h-4" />
                        <span>{form.domain}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {form.description}
                    </p>
                    
                    {/* Attributes */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Key Attributes:</p>
                      <div className="flex flex-wrap gap-2">
                        {form.attributes.slice(0, 3).map((attr, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-600">
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Mantra */}
                    <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-3 border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium mb-1">Sacred Mantra:</p>
                      <p className="text-sm text-gray-700 font-medium">{form.mantra}</p>
                    </div>
                    
                    <div className="pt-2">
                      <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors group">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Explore Deeper</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wisdom Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Understanding Divine Forms
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Each divine form represents different aspects of the ultimate reality, offering unique paths 
              to spiritual realization. Through understanding and devotion to these forms, seekers can 
              connect with the divine consciousness that permeates all existence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
              <Crown className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Wisdom</h3>
              <p className="text-sm text-gray-600">Each form teaches unique spiritual lessons</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Protection</h3>
              <p className="text-sm text-gray-600">Divine forms offer refuge and strength</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Transformation</h3>
              <p className="text-sm text-gray-600">Connect with divine consciousness</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-purple-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "सर्वं खल्विदं ब्रह्म"
            </blockquote>
            <p className="text-lg text-purple-600 mt-2">
              "All this is indeed Brahman" - Everything is divine
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
              Great Saints
            </a>
            <a href="/bhajans" className="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors">
              Sacred Bhajans
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Divine Form Modal */}
      <DivineFormModal
        divineForm={selectedDivineForm}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Divine;
