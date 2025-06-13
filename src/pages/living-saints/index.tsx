import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LivingSaintModal from '@/components/LivingSaintModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, Globe, Heart } from 'lucide-react';

const LivingSaints = () => {
  const [selectedSaint, setSelectedSaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const livingSaints = [
    {
      id: 1,
      name: "Premanand Ji Maharaj",
      nameHi: "प्रेमानंद जी महाराज",
      organization: "Vrindavan Dham",
      specialty: "Krishna Bhakti",
      specialtyHi: "कृष्ण भक्ति",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "A contemporary saint spreading the message of pure love and devotion to Lord Krishna through satsangs and spiritual discourses.",
      descriptionHi: "एक समकालीन संत जो सत्संग और आध्यात्मिक प्रवचनों के माध्यम से भगवान कृष्ण के लिए शुद्ध प्रेम और भक्ति का संदेश फैला रहे हैं।",
      website: "https://premanandjimaharaj.org",
      followers: "500K+",
      teachings: ["Divine Love", "Surrender", "Satsang", "Krishna Consciousness"],
      birthPlace: "Mathura, Uttar Pradesh",
      birthPlaceHi: "मथुरा, उत्तर प्रदेश",
      currentLocation: "Vrindavan, Uttar Pradesh",
      currentLocationHi: "वृंदावन, उत्तर प्रदेश",
      biography: "Premanand Ji Maharaj has dedicated his life to spreading the timeless message of Krishna consciousness. Born into a devout family, he showed early signs of spiritual inclination and devotion to Lord Krishna. His teachings emphasize the importance of surrender, divine love, and regular satsang as pathways to spiritual awakening.",
      biographyHi: "प्रेमानंद जी महाराज ने अपना जीवन कृष्ण चेतना के शाश्वत संदेश को फैलाने के लिए समर्पित किया है। एक धर्मनिष्ठ परिवार में जन्मे, उन्होंने प्रारंभिक आध्यात्मिक झुकाव और भगवान कृष्ण के प्रति भक्ति के संकेत दिखाए। उनकी शिक्षाएं समर्पण, दिव्य प्रेम और नियमित सत्संग के महत्व पर जोर देती हैं।",
      spiritualJourney: "From a young age, Premanand Ji was drawn to the divine pastimes of Lord Krishna. His spiritual journey began in the sacred lanes of Mathura, where he spent countless hours in meditation and bhajan. Under the guidance of his guru, he learned the deeper meanings of Krishna leela and began sharing this wisdom through heartfelt satsangs that touch the souls of thousands.",
      spiritualJourneyHi: "बचपन से ही, प्रेमानंद जी भगवान कृष्ण की दिव्य लीलाओं की ओर आकर्षित थे। उनकी आध्यात्मिक यात्रा मथुरा की पवित्र गलियों में शुरू हुई, जहां उन्होंने ध्यान और भजन में अनगिनत घंटे बिताए।",
      keyTeachings: ["Love is the only path to Krishna", "Surrender your ego to find divine bliss", "Satsang purifies the heart", "Serve with devotion and humility"],
      keyTeachingsHi: ["प्रेम ही कृष्ण का एकमात्र मार्ग है", "दिव्य आनंद पाने के लिए अपने अहंकार को समर्पित करें", "सत्संग हृदय को पवित्र करता है", "भक्ति और विनम्रता के साथ सेवा करें"],
      quotes: ["When you surrender completely to Krishna, He takes care of everything", "Love is not just an emotion, it is the very essence of our existence"],
      quotesHi: ["जब आप कृष्ण के सामने पूर्ण समर्पण करते हैं, तो वे सब कुछ संभाल लेते हैं", "प्रेम केवल एक भावना नहीं है, यह हमारे अस्तित्व का सार है"],
      ashram: "Premanand Ashram, Vrindavan",
      ashramHi: "प्रेमानंद आश्रम, वृंदावन",
      lineage: "Gaudiya Vaishnava Tradition",
      lineageHi: "गौड़ीय वैष्णव परंपरा"
    },
    {
      id: 2,
      name: "Mata Amritanandamayi",
      nameHi: "माता अमृतानंदमयी",
      organization: "Amrita University",
      specialty: "Universal Love",
      specialtyHi: "सार्वभौमिक प्रेम",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
      description: "Known as the 'Hugging Saint', she spreads love and compassion through her embrace and humanitarian work worldwide.",
      descriptionHi: "'आलिंगन संत' के नाम से प्रसिद्ध, वे अपने आलिंगन और दुनिया भर में मानवीय कार्यों के माध्यम से प्रेम और करुणा फैलाती हैं।",
      website: "https://amma.org",
      followers: "1M+",
      teachings: ["Selfless Love", "Service", "Compassion", "Unity"],
      birthPlace: "Parayakadavu, Kerala",
      birthPlaceHi: "परयकडवु, केरल",
      currentLocation: "Amritapuri, Kerala",
      currentLocationHi: "अमृतपुरी, केरल",
      biography: "Mata Amritanandamayi, known worldwide as Amma, has embraced over 40 million people from all walks of life. Her life is a testament to the power of unconditional love and selfless service. Through her humanitarian initiatives, she has built hospitals, schools, and provided disaster relief across the globe.",
      biographyHi: "माता अमृतानंदमयी, जो दुनिया भर में अम्मा के नाम से जानी जाती हैं, ने जीवन के सभी क्षेत्रों से 40 मिलियन से अधिक लोगों को गले लगाया है। उनका जीवन निःस्वार्थ प्रेम और निःस्वार्थ सेवा की शक्ति का प्रमाण है।",
      spiritualJourney: "Born in a small fishing village in Kerala, Amma showed extraordinary compassion from childhood. Despite facing many challenges and misunderstandings, she never wavered in her mission to spread love. Her spontaneous embrace of a leper when she was young marked the beginning of her unique form of blessing through physical touch.",
      spiritualJourneyHi: "केरल के एक छोटे मछुआरे गांव में जन्मी, अम्मा ने बचपन से ही असाधारण करुणा दिखाई। कई चुनौतियों और गलतफहमियों का सामना करने के बावजूद, वे प्रेम फैलाने के अपने मिशन में कभी नहीं डगमगाईं।",
      keyTeachings: ["Love is our true religion", "Serve others as you serve yourself", "Compassion can heal the world", "Unity in diversity is our strength"],
      keyTeachingsHi: ["प्रेम हमारा सच्चा धर्म है", "दूसरों की सेवा वैसे करें जैसे अपनी करते हैं", "करुणा दुनिया को ठीक कर सकती है", "विविधता में एकता हमारी शक्ति है"],
      quotes: ["Where there is love, there is no ego", "My children, love is the bridge between you and everything"],
      quotesHi: ["जहां प्रेम है, वहां अहंकार नहीं है", "मेरे बच्चों, प्रेम आपके और हर चीज के बीच एक पुल है"],
      ashram: "Amritapuri Ashram",
      ashramHi: "अमृतपुरी आश्रम",
      lineage: "Self-realized Saint",
      lineageHi: "स्वयं साक्षात्कृत संत"
    },
    {
      id: 3,
      name: "Sadhguru Jaggi Vasudev",
      nameHi: "सद्गुरु जग्गी वासुदेव",
      organization: "Isha Foundation",
      specialty: "Inner Engineering",
      specialtyHi: "आंतरिक इंजीनियरिंग",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop",
      description: "A modern mystic bridging ancient wisdom with contemporary life through yoga and meditation practices.",
      descriptionHi: "एक आधुनिक रहस्यवादी जो योग और ध्यान प्रथाओं के माध्यम से प्राचीन ज्ञान को समकालीन जीवन से जोड़ते हैं।",
      website: "https://isha.sadhguru.org",
      followers: "2M+",
      teachings: ["Yoga", "Inner Engineering", "Consciousness", "Environmental Action"],
      birthPlace: "Mysore, Karnataka",
      birthPlaceHi: "मैसूर, कर्नाटक",
      currentLocation: "Coimbatore, Tamil Nadu",
      currentLocationHi: "कोयंबटूर, तमिल नाडु",
      biography: "Sadhguru is a realized master, yogi and mystic who has dedicated himself to the physical, mental and spiritual wellbeing of humanity. His approach does not ascribe to any belief system, but offers methods for self-transformation that are both contemporary and universal.",
      biographyHi: "सद्गुरु एक साक्षात्कृत गुरु, योगी और रहस्यवादी हैं जिन्होंने खुद को मानवता के शारीरिक, मानसिक और आध्यात्मिक कल्याण के लिए समर्पित किया है।",
      spiritualJourney: "At the age of 25, Sadhguru had an intense spiritual experience that transformed his life completely. What began as a simple moment of sitting on a rock became a profound realization that changed not just his perception, but his very experience of life. This experience led him to share the science of inner transformation with the world.",
      spiritualJourneyHi: "25 साल की उम्र में, सद्गुरु का एक गहन आध्यात्मिक अनुभव हुआ जिसने उनके जीवन को पूरी तरह से बदल दिया। एक चट्टान पर बैठने का सरल क्षण एक गहन अनुभूति बन गया।",
      keyTeachings: ["Consciousness is the only true reality", "Create your own destiny", "Inner transformation leads to outer change", "Embrace life totally"],
      keyTeachingsHi: ["चेतना ही एकमात्र सच्ची वास्तविकता है", "अपना भाग्य खुद बनाएं", "आंतरिक परिवर्तन बाहरी बदलाव की ओर ले जाता है", "जीवन को पूर्ण रूप से अपनाएं"],
      quotes: ["The only way out is in", "Life is not about what you know, but what you are willing to learn"],
      quotesHi: ["बाहर निकलने का एकमात्र रास्ता अंदर है", "जीवन इस बारे में नहीं है कि आप क्या जानते हैं, बल्कि आप क्या सीखने को तैयार हैं"],
      ashram: "Isha Yoga Center",
      ashramHi: "ईशा योग केंद्र",
      lineage: "Classical Yoga Tradition",
      lineageHi: "शास्त्रीय योग परंपरा"
    },
    {
      id: 4,
      name: "Sri Sri Ravi Shankar",
      nameHi: "श्री श्री रवि शंकर",
      organization: "Art of Living",
      specialty: "Breathing Techniques",
      specialtyHi: "श्वास तकनीक",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      description: "Founder of Art of Living, promoting peace and well-being through Sudarshan Kriya and spiritual practices.",
      descriptionHi: "आर्ट ऑफ लिविंग के संस्थापक, सुदर्शन क्रिया और आध्यात्मिक प्रथाओं के माध्यम से शांति और कल्याण को बढ़ावा देने वाले।",
      website: "https://artofliving.org",
      followers: "3M+",
      teachings: ["Sudarshan Kriya", "Peace", "Stress Relief", "Global Harmony"],
      birthPlace: "Papanasam, Tamil Nadu",
      birthPlaceHi: "पपनासम, तमिल नाडु",
      currentLocation: "Bangalore, Karnataka",
      currentLocationHi: "बैंगलोर, कर्नाटक",
      biography: "Sri Sri Ravi Shankar is a global humanitarian leader, spiritual teacher and peace ambassador. Through his work, the Art of Living Foundation has touched the lives of over 450 million people worldwide. His breathing techniques and wisdom have brought peace to individuals and communities across the globe.",
      biographyHi: "श्री श्री रवि शंकर एक वैश्विक मानवतावादी नेता, आध्यात्मिक शिक्षक और शांति दूत हैं। उनके काम के माध्यम से, आर्ट ऑफ लिविंग फाउंडेशन ने दुनिया भर में 450 मिलियन से अधिक लोगों के जीवन को छुआ है।",
      spiritualJourney: "From childhood, Sri Sri showed exceptional spiritual inclination. At the age of 17, he went into ten days of silence, during which the Sudarshan Kriya was revealed to him. This powerful breathing technique became the cornerstone of his teachings and has since transformed millions of lives across the world.",
      spiritualJourneyHi: "बचपन से ही, श्री श्री ने असाधारण आध्यात्मिक झुकाव दिखाया। 17 साल की उम्र में, वे दस दिन के मौन में गए, जिसके दौरान उन्हें सुदर्शन क्रिया का रहस्योद्घाटन हुआ।",
      keyTeachings: ["Breath is the link between body and mind", "Service before self", "Celebrate diversity", "Stress-free mind leads to violence-free society"],
      keyTeachingsHi: ["श्वास शरीर और मन के बीच की कड़ी है", "स्वयं से पहले सेवा", "विविधता का जश्न मनाएं", "तनाव मुक्त मन हिंसा मुक्त समाज की ओर ले जाता है"],
      quotes: ["When you are unhappy, you are consuming yourself", "The quality of our life depends on the quality of our mind"],
      quotesHi: ["जब आप दुखी हैं, तो आप खुद को खा रहे हैं", "हमारे जीवन की गुणवत्ता हमारे मन की गुणवत्ता पर निर्भर करती है"],
      ashram: "Art of Living International Center",
      ashramHi: "आर्ट ऑफ लिविंग अंतर्राष्ट्रीय केंद्र",
      lineage: "Vedic Tradition",
      lineageHi: "वैदिक परंपरा"
    },
    {
      id: 5,
      name: "Swami Chidanand Saraswati",
      nameHi: "स्वामी चिदानंद सरस्वती",
      organization: "Parmarth Niketan",
      specialty: "Ganga Conservation",
      specialtyHi: "गंगा संरक्षण",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      description: "Leading environmental and spiritual activism, particularly for the preservation of River Ganga and yoga promotion.",
      descriptionHi: "पर्यावरण और आध्यात्मिक सक्रियता का नेतृत्व, विशेष रूप से गंगा नदी के संरक्षण और योग प्रचार के लिए।",
      website: "https://parmarth.org",
      followers: "800K+",
      teachings: ["Environmental Protection", "Yoga", "River Conservation", "Spiritual Ecology"],
      birthPlace: "Muni Ki Reti, Rishikesh",
      birthPlaceHi: "मुनि की रेती, ऋषिकेश",
      currentLocation: "Rishikesh, Uttarakhand",
      currentLocationHi: "ऋषिकेश, उत्तराखंड",
      biography: "Swami Chidanand Saraswati is the President and Spiritual Head of Parmarth Niketan Ashram, Rishikesh. He is a renowned spiritual leader who bridges the ancient and the modern, the East and the West, and the spiritual and the scientific.",
      biographyHi: "स्वामी चिदानंद सरस्वती परमार्थ निकेतन आश्रम, ऋषिकेश के अध्यक्ष और आध्यात्मिक प्रमुख हैं। वे एक प्रसिद्ध आध्यात्मिक नेता हैं जो प्राचीन और आधुनिक को जोड़ते हैं।",
      spiritualJourney: "Born on the sacred banks of the Ganga in Rishikesh, Swamiji's life has been dedicated to the preservation of India's spiritual and environmental heritage. From childhood, he showed deep reverence for Mother Ganga and has spent his life working tirelessly for her conservation and the welfare of humanity.",
      spiritualJourneyHi: "ऋषिकेश में गंगा के पवित्र तट पर जन्मे, स्वामी जी का जीवन भारत की आध्यात्मिक और पर्यावरणीय विरासत के संरक्षण के लिए समर्पित रहा है।",
      keyTeachings: ["Ganga is our mother, protect her", "Yoga is unity of body, mind and soul", "Seva is the highest dharma", "Environment protection is spiritual practice"],
      keyTeachingsHi: ["गंगा हमारी माता है, उसकी रक्षा करें", "योग शरीर, मन और आत्मा की एकता है", "सेवा सर्वोच्च धर्म है", "पर्यावरण संरक्षण आध्यात्मिक अभ्यास है"],
      quotes: ["When we serve the Ganga, we serve all of humanity", "Yoga is not just exercise, it is the science of life"],
      quotesHi: ["जब हम गंगा की सेवा करते हैं, तो हम पूरी मानवता की सेवा करते हैं", "योग केवल व्यायाम नहीं है, यह जीवन का विज्ञान है"],
      ashram: "Parmarth Niketan Ashram",
      ashramHi: "परमार्थ निकेतन आश्रम",
      lineage: "Sanatan Dharma Tradition",
      lineageHi: "सनातन धर्म परंपरा"
    },
    {
      id: 6,
      name: "Brahmarishi Shree Kumar Swami Ji",
      nameHi: "ब्रह्मर्षि श्री कुमार स्वामी जी",
      organization: "Vishwa Jagriti Mission",
      specialty: "Vedic Wisdom",
      specialtyHi: "वैदिक ज्ञान",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      description: "Teaching ancient Vedic wisdom and meditation techniques for modern spiritual seekers and global peace.",
      descriptionHi: "आधुनिक आध्यात्मिक साधकों और विश्व शांति के लिए प्राचीन वैदिक ज्ञान और ध्यान तकनीकों को सिखाने वाले।",
      website: "https://vishwajagriti.org",
      followers: "400K+",
      teachings: ["Vedic Knowledge", "Meditation", "World Peace", "Ancient Wisdom"],
      birthPlace: "Haridwar, Uttarakhand",
      birthPlaceHi: "हरिद्वार, उत्तराखंड",
      currentLocation: "Various Ashrams across India",
      currentLocationHi: "भारत भर में विभिन्न आश्रम",
      biography: "Brahmarishi Shree Kumar Swami Ji is a revered spiritual master who has dedicated his life to spreading the timeless wisdom of the Vedas. Through his teachings and meditation practices, he has guided thousands of seekers on their spiritual journey towards self-realization and inner peace.",
      biographyHi: "ब्रह्मर्षि श्री कुमार स्वामी जी एक पूजनीय आध्यात्मिक गुरु हैं जिन्होंने अपना जीवन वेदों के शाश्वत ज्ञान को फैलाने के लिए समर्पित किया है।",
      spiritualJourney: "Born in the holy city of Haridwar, Swami Ji showed extraordinary spiritual inclination from childhood. His deep study of Vedic scriptures and intensive meditation practices led him to profound realizations about the nature of existence and consciousness. He established the Vishwa Jagriti Mission to share these ancient teachings with the modern world.",
      spiritualJourneyHi: "पवित्र शहर हरिद्वार में जन्मे, स्वामी जी ने बचपन से ही असाधारण आध्यात्मिक झुकाव दिखाया। वैदिक शास्त्रों के उनके गहन अध्ययन और गहन ध्यान अभ्यासों ने उन्हें अस्तित्व और चेतना की प्रकृति के बारे में गहन अनुभूति दी।",
      keyTeachings: ["Vedas contain universal truths", "Meditation is the path to self-realization", "World peace begins with inner peace", "Ancient wisdom for modern problems"],
      keyTeachingsHi: ["वेदों में सार्वभौमिक सत्य हैं", "ध्यान आत्म-साक्षात्कार का मार्ग है", "विश्व शांति आंतरिक शांति से शुरू होती है", "आधुनिक समस्याओं के लिए प्राचीन ज्ञान"],
      quotes: ["The Vedas are not just scriptures, they are the manual for human life", "In silence, the deepest truths are revealed"],
      quotesHi: ["वेद केवल शास्त्र नहीं हैं, वे मानव जीवन की पुस्तिका हैं", "मौन में, सबसे गहरे सत्य प्रकट होते हैं"],
      ashram: "Vishwa Jagriti Mission Centers",
      ashramHi: "विश्व जागृति मिशन केंद्र",
      lineage: "Vedic Rishi Tradition",
      lineageHi: "वैदिक ऋषि परंपरा"
    }
  ];

  const handleCardClick = (saint) => {
    setSelectedSaint(saint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSaint(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-red-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Living Saints
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with contemporary spiritual masters who continue to illuminate the path of devotion, 
              spreading divine wisdom and compassion in our modern world.
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-red-100 text-red-700 px-4 py-2">
                {livingSaints.length} Contemporary Guides
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Living Saints Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {livingSaints.map((saint) => (
              <Card 
                key={saint.id} 
                className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                onClick={() => handleCardClick(saint)}
              >
                <div className="relative">
                  <img 
                    src={saint.image} 
                    alt={saint.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-red-700">
                      {saint.specialty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-1 text-white text-sm">
                      <Users className="w-4 h-4" />
                      <span>{saint.followers}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                      {saint.name}
                    </h3>
                    <p className="text-sm text-red-600 font-medium">
                      {saint.nameHi}
                    </p>
                    <p className="text-sm text-gray-500">
                      {saint.organization}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {saint.description}
                  </p>
                  
                  {/* Teachings Tags */}
                  <div className="flex flex-wrap gap-2">
                    {saint.teachings.slice(0, 3).map((teaching, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600">
                        {teaching}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors group">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Learn More</span>
                    </button>
                    
                    <a 
                      href={saint.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-gradient-to-r from-red-100 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Living Wisdom for Modern Times
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              These contemporary spiritual masters bridge ancient wisdom with modern challenges, 
              offering practical guidance for today's seekers. Their teachings continue to transform lives 
              and spread peace across the globe.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-red-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "In the company of the wise, ignorance disappears"
            </blockquote>
            <p className="text-lg text-red-600 mt-2">
              "सज्जनों की संगति में अज्ञान मिट जाता है"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
              Great Saints
            </a>
            <a href="/bhajans" className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors">
              Bhajans & Quotes
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Saint Modal */}
      <LivingSaintModal
        saint={selectedSaint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LivingSaints;
