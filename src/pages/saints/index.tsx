
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SaintModal from '@/components/SaintModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin } from 'lucide-react';

const Saints = () => {
  const [selectedSaint, setSelectedSaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saints = [
    {
      id: 1,
      name: "Meera Bai",
      nameHi: "मीरा बाई",
      period: "1498-1547",
      region: "Rajasthan",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "A devoted bhakt of Lord Krishna, known for her passionate devotional poetry and songs",
      descriptionHi: "भगवान कृष्ण की एक समर्पित भक्त, अपनी भावनाप्रधान भक्ति कविता और गीतों के लिए प्रसिद्ध",
      specialty: "Devotional Poetry",
      specialtyHi: "भक्ति काव्य",
      biography: "Meera Bai was a 16th-century Hindu mystic poet and devotee of Krishna. Born into a royal Rajput family, she dedicated her life to Krishna devotion despite facing persecution from her in-laws. Her devotional songs and poems express intense spiritual longing and have inspired countless devotees. She renounced worldly pleasures to live as a wandering ascetic, singing bhajans in temples. Her fearless devotion and poetic genius made her one of the most beloved saints in Indian spiritual tradition. Her compositions continue to be sung across India, touching hearts with their pure love for the divine.",
      biographyHi: "मीरा बाई 16वीं सदी की एक हिंदू रहस्यवादी कवयित्री और कृष्ण भक्त थीं। राजपूत राजघराने में जन्मी, उन्होंने अपने ससुराल वालों के अत्याचार सहकर भी अपना जीवन कृष्ण भक्ति में समर्पित कर दिया। उनके भक्ति गीत और कविताएं गहरी आध्यात्मिक तड़प व्यक्त करती हैं और अनगिनत भक्तों को प्रेरणा देती हैं। उन्होंने सांसारिक सुखों का त्याग कर मंदिरों में भजन गाते हुए एक भटकती हुई तपस्विनी का जीवन जिया। उनकी निडर भक्ति और काव्य प्रतिभा ने उन्हें भारतीय आध्यात्मिक परंपरा की सबसे प्रिय संतों में से एक बनाया।"
    },
    {
      id: 2,
      name: "Kabir Das",
      nameHi: "कबीर दास",
      period: "1440-1518",
      region: "Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
      description: "A mystic poet whose verses bridge Hindu and Islamic traditions with universal truths",
      descriptionHi: "एक रहस्यवादी कवि जिनके छंद हिंदू और इस्लामी परंपराओं को सार्वभौमिक सत्य से जोड़ते हैं",
      specialty: "Mystical Poetry",
      specialtyHi: "रहस्यवादी काव्य",
      biography: "Kabir Das was a 15th-century Indian mystic poet and saint who played a pivotal role in the Bhakti movement. Born into a Muslim weaver family, he transcended religious boundaries through his universal spiritual message. His poetry criticized religious orthodoxy and emphasized the unity of all faiths. Kabir's verses, simple yet profound, spoke directly to the common people about the divine presence within. He advocated for a personal relationship with God beyond rituals and ceremonies. His teachings influenced both Hindu and Islamic traditions, and his dohas (couplets) remain popular across India for their wisdom and spiritual insight.",
      biographyHi: "कबीर दास 15वीं सदी के एक भारतीय रहस्यवादी कवि और संत थे जिन्होंने भक्ति आंदोलन में महत्वपूर्ण भूमिका निभाई। मुस्लिम जुलाहा परिवार में जन्मे, उन्होंने अपने सार्वभौमिक आध्यात्मिक संदेश से धार्मिक सीमाओं को पार किया। उनकी कविता ने धार्मिक कट्टरता की आलोचना की और सभी धर्मों की एकता पर जोर दिया। कबीर के सादे लेकिन गहरे छंद सामान्य लोगों से सीधे अंतर्निहित दिव्यता के बारे में बात करते थे। उन्होंने कर्मकांड और समारोहों से परे ईश्वर के साथ व्यक्तिगत संबंध की वकालत की। उनकी शिक्षाओं ने हिंदू और इस्लामी दोनों परंपराओं को प्रभावित किया।"
    },
    {
      id: 3,
      name: "Tulsidas",
      nameHi: "तुलसीदास",
      period: "1532-1623",
      region: "Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop",
      description: "Author of Ramcharitmanas, bringing the Ramayana to the common people in Hindi",
      descriptionHi: "रामचरितमानस के रचयिता, रामायण को हिंदी में आम जनता तक पहुंचाने वाले",
      specialty: "Epic Literature",
      specialtyHi: "महाकाव्य साहित्य",
      biography: "Tulsidas was a 16th-century Hindu poet-saint, best known for authoring the Ramcharitmanas, an epic poem in Awadhi language based on the Sanskrit Ramayana. Born in a Brahmin family, he dedicated his life to Lord Rama and made the epic accessible to common people by writing in the vernacular. His work bridged the gap between Sanskrit literature and popular devotion. Beyond Ramcharitmanas, he composed numerous devotional works including Hanuman Chalisa. His profound devotion, literary genius, and ability to connect with masses made him one of the most influential figures in Hindu literature and spirituality.",
      biographyHi: "तुलसीदास 16वीं सदी के एक हिंदू कवि-संत थे, जो संस्कृत रामायण पर आधारित अवधी भाषा के महाकाव्य रामचरितमानस के लेखक के रूप में प्रसिद्ध हैं। ब्राह्मण परिवार में जन्मे, उन्होंने अपना जीवन भगवान राम को समर्पित किया और देशी भाषा में लिखकर महाकाव्य को आम लोगों के लिए सुलभ बनाया। उनकी कृति ने संस्कृत साहित्य और लोकप्रिय भक्ति के बीच की खाई को पाटा। रामचरितमानस के अलावा, उन्होंने हनुमान चालीसा सहित कई भक्ति कृतियों की रचना की। उनकी गहरी भक्ति, साहित्यिक प्रतिभा और जनसाधारण से जुड़ने की क्षमता ने उन्हें हिंदू साहित्य और आध्यात्म के सबसे प्रभावशाली व्यक्तित्वों में से एक बनाया।"
    },
    {
      id: 4,
      name: "Surdas",
      nameHi: "सूरदास",
      period: "1478-1583",
      region: "Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=400&fit=crop",
      description: "Blind poet-saint devoted to Lord Krishna, famous for his emotional bhajans",
      descriptionHi: "भगवान कृष्ण के समर्पित अंधे कवि-संत, अपने भावनात्मक भजनों के लिए प्रसिद्ध",
      specialty: "Krishna Bhakti",
      specialtyHi: "कृष्ण भक्ति",
      biography: "Surdas was a 16th-century blind saint-poet renowned for his devotional songs dedicated to Lord Krishna. Despite his physical blindness, he possessed extraordinary spiritual vision that enabled him to compose soul-stirring verses about Krishna's childhood and divine play. His compositions, collectively known as 'Sur Sagar,' capture the intimate and playful aspects of Krishna's personality with remarkable emotional depth. Surdas had the unique ability to paint vivid pictures through words, making listeners feel as if they were witnessing Krishna's leelas firsthand. His bhajans remain among the most beloved devotional songs in North India.",
      biographyHi: "सूरदास 16वीं सदी के एक अंधे संत-कवि थे जो भगवान कृष्ण को समर्पित अपने भक्ति गीतों के लिए प्रसिद्ध हैं। शारीरिक अंधत्व के बावजूद, उनके पास असाधारण आध्यात्मिक दृष्टि थी जिसने उन्हें कृष्ण के बचपन और दिव्य लीलाओं के बारे में मर्मस्पर्शी छंद रचने में सक्षम बनाया। उनकी रचनाएं, जिन्हें सामूहिक रूप से 'सूर सागर' के नाम से जाना जाता है, कृष्ण के व्यक्तित्व के अंतरंग और खेल भरे पहलुओं को उल्लेखनीय भावनात्मक गहराई के साथ पकड़ती हैं। सूरदास में शब्दों के माध्यम से जीवंत चित्र बनाने की अनूठी क्षमता थी।"
    },
    {
      id: 5,
      name: "Rahim",
      nameHi: "रहीम",
      period: "1556-1627",
      region: "Delhi",
      image: "https://images.unsplash.com/photo-1595147389795-37094173bfd8?w=400&h=400&fit=crop",
      description: "Court poet of Akbar, known for his spiritual dohas and universal message of love",
      descriptionHi: "अकबर के दरबारी कवि, अपने आध्यात्मिक दोहों और प्रेम के सार्वभौमिक संदेश के लिए प्रसिद्ध",
      specialty: "Spiritual Dohas",
      specialtyHi: "आध्यात्मिक दोहे",
      biography: "Abdul Rahim Khan-i-Khana, known simply as Rahim, was a 16th-century poet, composer, and aristocrat who served as a courtier in Emperor Akbar's court. Despite his royal position and Muslim heritage, his poetry transcended religious boundaries and reflected deep spiritual wisdom. His dohas (couplets) are masterpieces of brevity and profundity, offering timeless lessons on life, love, and spirituality. Rahim's verses demonstrate the synthesis of Islamic and Hindu philosophical traditions, embodying the spirit of religious harmony that characterized Akbar's reign. His poetry continues to be quoted widely for its moral and spiritual insights.",
      biographyHi: "अब्दुल रहीम खान-ए-खाना, जिन्हें केवल रहीम के नाम से जाना जाता है, 16वीं सदी के एक कवि, संगीतकार और अभिजात थे जिन्होंने सम्राट अकबर के दरबार में दरबारी के रूप में सेवा की। अपनी शाही स्थिति और मुस्लिम विरासत के बावजूद, उनकी कविता ने धार्मिक सीमाओं को पार किया और गहरी आध्यात्मिक बुद्धि को दर्शाया। उनके दोहे संक्षिप्तता और गहराई की उत्कृष्ट कृतियां हैं, जो जीवन, प्रेम और आध्यात्म पर कालातीत शिक्षा प्रदान करते हैं। रहीम के छंद इस्लामी और हिंदू दार्शनिक परंपराओं के संश्लेषण को दर्शाते हैं।"
    },
    {
      id: 6,
      name: "Chaitanya Mahaprabhu",
      nameHi: "चैतन्य महाप्रभु",
      period: "1486-1534",
      region: "West Bengal",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "Founder of Gaudiya Vaishnavism, popularized the Hare Krishna movement",
      descriptionHi: "गौड़ीय वैष्णववाद के संस्थापक, हरे कृष्ण आंदोलन को लोकप्रिय बनाने वाले",
      specialty: "Bhakti Movement",
      specialtyHi: "भक्ति आंदोलन",
      biography: "Chaitanya Mahaprabhu was a 15th-16th century Bengali Hindu saint who founded Gaudiya Vaishnavism and popularized the chanting of the Hare Krishna mantra. Born as Vishvambhar Mishra, he experienced a profound spiritual transformation in his youth and dedicated his life to spreading Krishna consciousness. His emotional and ecstatic devotion to Krishna revolutionized the bhakti movement in Bengal and beyond. He emphasized the practice of sankirtana (congregational chanting) as the most effective means of spiritual realization in the current age. His teachings and example inspired millions and laid the foundation for the global Hare Krishna movement that continues today.",
      biographyHi: "चैतन्य महाप्रभु 15वीं-16वीं सदी के एक बंगाली हिंदू संत थे जिन्होंने गौड़ीय वैष्णववाद की स्थापना की और हरे कृष्ण मंत्र के जाप को लोकप्रिय बनाया। विश्वंभर मिश्र के रूप में जन्मे, उन्होंने अपनी युवावस्था में एक गहरा आध्यात्मिक परिवर्तन अनुभव किया और अपना जीवन कृष्ण चेतना के प्रसार में समर्पित कर दिया। कृष्ण के प्रति उनकी भावनात्मक और परमानंदपूर्ण भक्ति ने बंगाल और उससे आगे भक्ति आंदोलन में क्रांति ला दी। उन्होंने संकीर्तन (सामूहिक कीर्तन) के अभ्यास पर जोर दिया जो वर्तमान युग में आध्यात्मिक प्राप्ति का सबसे प्रभावी साधन है।"
    }
  ];

  const handleSaintClick = (saint) => {
    setSelectedSaint(saint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSaint(null), 300); // Delay to allow exit animation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-orange-100 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Great Saints
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the profound wisdom and divine teachings of India's most revered spiritual masters 
              who have guided humanity on the path of devotion and enlightenment.
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                {saints.length} Sacred Biographies
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Saints Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saints.map((saint, index) => (
              <motion.div
                key={saint.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                  onClick={() => handleSaintClick(saint)}
                >
                  <div className="relative">
                    <img 
                      src={saint.image} 
                      alt={saint.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-orange-700">
                        {saint.specialty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {saint.name}
                      </h3>
                      <p className="text-sm text-orange-600 font-medium">
                        {saint.nameHi}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{saint.period}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{saint.region}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {saint.description}
                    </p>
                    
                    <div className="pt-2">
                      <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors group">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Read More</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Continue Your Spiritual Journey
          </h2>
          <p className="text-lg text-gray-600">
            Explore more aspects of divine wisdom through our other sections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/living-saints" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
              Living Saints
            </a>
            <a href="/divine" className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-50 transition-colors">
              Divine Forms
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Saint Modal */}
      <SaintModal
        saint={selectedSaint}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Saints;
