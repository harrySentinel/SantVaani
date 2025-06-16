import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Phone, Mail, Heart, Users, Home } from 'lucide-react';
import DonationModal from '@/components/DonationModal';

interface Organization {
  id: number;
  name: string;
  nameHi: string;
  type: 'Vridh Ashram' | 'Orphanage';
  typeHi: string;
  location: string;
  locationHi: string;
  establishedYear: number;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  description: string;
  descriptionHi: string;
  needs: string[];
  capacity: number;
  qrCodeUrl?: string;
}

const organizations: Organization[] = [
  {
    id: 1,
    name: "Seva Sadan Elder Care",
    nameHi: "सेवा सदन वृद्ध आश्रम",
    type: "Vridh Ashram",
    typeHi: "वृद्ध आश्रम",
    location: "Varanasi, Uttar Pradesh",
    locationHi: "वाराणसी, उत्तर प्रदेश",
    establishedYear: 1985,
    contact: {
      phone: "+91 98765 43210",
      email: "sevasadan@gmail.com",
      address: "123 Ghats Road, Varanasi - 221001"
    },
    description: "A peaceful sanctuary for elderly citizens providing care, medical support, and spiritual guidance.",
    descriptionHi: "वृद्ध नागरिकों के लिए एक शांतिपूर्ण आश्रय जो देखभाल, चिकित्सा सहायता और आध्यात्मिक मार्गदर्शन प्रदान करता है।",
    needs: ["Medical supplies", "Daily meals", "Clothing", "Volunteer support"],
    capacity: 80
  },
  {
    id: 2,
    name: "Bal Seva Orphanage",
    nameHi: "बाल सेवा अनाथालय",
    type: "Orphanage",
    typeHi: "अनाथालय",
    location: "Rishikesh, Uttarakhand",
    locationHi: "ऋषिकेश, उत्तराखंड",
    establishedYear: 1992,
    contact: {
      phone: "+91 98765 43211",
      email: "balseva@gmail.com",
      address: "456 Ganges View, Rishikesh - 249201"
    },
    description: "Nurturing orphaned children with education, love, and values to build a brighter future.",
    descriptionHi: "अनाथ बच्चों का पालन-पोषण शिक्षा, प्रेम और संस्कारों के साथ उज्ज्वल भविष्य बनाने के लिए।",
    needs: ["Educational materials", "Food supplies", "School uniforms", "Sports equipment"],
    capacity: 120
  },
  {
    id: 3,
    name: "Matru Sadan",
    nameHi: "मातृ सदन वृद्ध आश्रम",
    type: "Vridh Ashram",
    typeHi: "वृद्ध आश्रम",
    location: "Haridwar, Uttarakhand",
    locationHi: "हरिद्वार, उत्तराखंड",
    establishedYear: 1978,
    contact: {
      phone: "+91 98765 43212",
      email: "matrusadan@gmail.com",
      address: "789 Har Ki Pauri, Haridwar - 249401"
    },
    description: "Dedicated to serving elderly women with dignity, care, and spiritual comfort in their golden years.",
    descriptionHi: "वृद्ध महिलाओं की सेवा करने के लिए समर्पित जो उनके स्वर्णिम वर्षों में गरिमा, देखभाल और आध्यात्मिक सांत्वना प्रदान करता है।",
    needs: ["Healthcare support", "Physiotherapy equipment", "Warm clothing", "Nutritious food"],
    capacity: 60
  },
  {
    id: 4,
    name: "Sunshine Children's Home",
    nameHi: "सनशाइन बाल गृह",
    type: "Orphanage",
    typeHi: "अनाथालय",
    location: "Mathura, Uttar Pradesh",
    locationHi: "मथुरा, उत्तर प्रदेश",
    establishedYear: 2001,
    contact: {
      phone: "+91 98765 43213",
      email: "sunshine@gmail.com",
      address: "321 Krishna Nagar, Mathura - 281001"
    },
    description: "Creating a loving family environment for orphaned children with focus on holistic development.",
    descriptionHi: "अनाथ बच्चों के लिए एक प्रेमपूर्ण पारिवारिक वातावरण बनाना जो समग्र विकास पर केंद्रित है।",
    needs: ["Computer equipment", "Library books", "Musical instruments", "Healthcare support"],
    capacity: 90
  },
  {
    id: 5,
    name: "Vrindavan Seva Ashram",
    nameHi: "वृंदावन सेवा आश्रम",
    type: "Vridh Ashram",
    typeHi: "वृद्ध आश्रम",
    location: "Vrindavan, Uttar Pradesh",
    locationHi: "वृंदावन, उत्तर प्रदेश",
    establishedYear: 1995,
    contact: {
      phone: "+91 98765 43214",
      email: "vrindavanseva@gmail.com",
      address: "567 Radha Krishna Temple Road, Vrindavan - 281121"
    },
    description: "A divine abode for elderly devotees seeking spiritual solace in the holy land of Krishna.",
    descriptionHi: "कृष्ण की पवित्र भूमि में आध्यात्मिक सांत्वना चाहने वाले वृद्ध भक्तों के लिए एक दिव्य निवास।",
    needs: ["Wheelchair accessibility", "Ayurvedic medicines", "Spiritual books", "Daily meals"],
    capacity: 100
  },
  {
    id: 6,
    name: "Hope Foundation Orphanage",
    nameHi: "होप फाउंडेशन अनाथालय",
    type: "Orphanage",
    typeHi: "अनाथालय",
    location: "Amritsar, Punjab",
    locationHi: "अमृतसर, पंजाब",
    establishedYear: 1988,
    contact: {
      phone: "+91 98765 43215",
      email: "hopefoundation@gmail.com",
      address: "890 Golden Temple Road, Amritsar - 143001"
    },
    description: "Empowering orphaned children through quality education and skill development programs.",
    descriptionHi: "गुणवत्तापूर्ण शिक्षा और कौशल विकास कार्यक्रमों के माध्यम से अनाथ बच्चों को सशक्त बनाना।",
    needs: ["Vocational training equipment", "Study materials", "Sports facilities", "Nutritious meals"],
    capacity: 150
  }
];

const Donation = () => {
  const [selectedType, setSelectedType] = useState<'All' | 'Vridh Ashram' | 'Orphanage'>('All');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isHindi, setIsHindi] = useState(false);

  // Listen for language changes from navbar (you could use context for this in a real app)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language') {
        setIsHindi(e.newValue === 'hindi');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredOrganizations = selectedType === 'All' 
    ? organizations 
    : organizations.filter(org => org.type === selectedType);

  const getTypeIcon = (type: string) => {
    return type === 'Vridh Ashram' ? Users : Home;
  };

  const getTypeColor = (type: string) => {
    return type === 'Vridh Ashram' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600';
  };

  const handleSupportClick = (org: Organization) => {
    setSelectedOrganization(org);
  };

  const getText = (en: string, hi: string) => isHindi ? hi : en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              {getText('Donation Support', 'दान सहयोग')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            {getText('सेवा और करुणा के द्वार', 'सेवा और करुणा के द्वार')}
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            {getText(
              'Support our sacred mission of serving elderly citizens and orphaned children. Your generous donations help provide care, education, and hope to those who need it most.',
              'वृद्ध नागरिकों और अनाथ बच्चों की सेवा के हमारे पवित्र मिशन का समर्थन करें। आपका उदार दान उन लोगों को देखभाल, शिक्षा और आशा प्रदान करने में मदद करता है जिन्हें इसकी सबसे अधिक आवश्यकता है।'
            )}
          </p>
        </div>

        {/* Responsive Filter Tabs */}
        <div className="flex justify-center mb-8">
          {/* Desktop Version */}
          <div className="hidden sm:block bg-white rounded-full p-1 shadow-lg border border-orange-200">
            {(['All', 'Vridh Ashram', 'Orphanage'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {type === 'All' 
                  ? getText('All Organizations', 'सभी संस्थाएं') 
                  : type === 'Vridh Ashram' 
                  ? getText('Vridh Ashram', 'वृद्ध आश्रम')
                  : getText('Orphanage', 'अनाथालय')
                }
              </button>
            ))}
          </div>

          {/* Mobile Version */}
          <div className="sm:hidden w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-orange-200">
              <div className="grid grid-cols-1 gap-2">
                {(['All', 'Vridh Ashram', 'Orphanage'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {type === 'All' 
                      ? getText('All Organizations', 'सभी संस्थाएं') 
                      : type === 'Vridh Ashram' 
                      ? getText('Vridh Ashram', 'वृद्ध आश्रम')
                      : getText('Orphanage', 'अनाथालय')
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredOrganizations.map((org) => {
            const TypeIcon = getTypeIcon(org.type);
            return (
              <Card key={org.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className={`bg-gradient-to-r ${getTypeColor(org.type)} text-white border-0 px-3 py-1`}
                    >
                      <TypeIcon className="w-4 h-4 mr-1" />
                      {getText(org.type, org.typeHi)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {org.establishedYear}
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {getText(org.name, org.nameHi)}
                  </CardTitle>
                  <p className="text-sm text-orange-600 font-medium">
                    {getText(org.nameHi, org.name)}
                  </p>
                  
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">{getText(org.location, org.locationHi)}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {getText(org.description, org.descriptionHi)}
                  </p>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {getText('Current Needs:', 'वर्तमान आवश्यकताएं:')}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {org.needs.slice(0, 2).map((need, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white/80">
                          {need}
                        </Badge>
                      ))}
                      {org.needs.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-white/80">
                          +{org.needs.length - 2} {getText('more', 'और')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-orange-500" />
                      {org.contact.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-orange-500" />
                      {org.contact.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-orange-500" />
                      {getText('Capacity:', 'क्षमता:')} {org.capacity} {getText('residents', 'निवासी')}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSupportClick(org)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 rounded-xl transition-all duration-300"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {getText('Support This Organization', 'इस संस्था का समर्थन करें')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-8 border border-orange-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {getText('Join Our Mission of Service', 'सेवा के हमारे मिशन में शामिल हों')}
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {getText(
              'Every contribution, no matter how small, creates ripples of positive change. Together, we can provide care, comfort, and hope to those who need it most.',
              'हर योगदान, चाहे वह कितना भी छोटा हो, सकारात्मक बदलाव की लहरें पैदा करता है। मिलकर, हम उन लोगों को देखभाल, आराम और आशा प्रदान कर सकते हैं जिन्हें इसकी सबसे अधिक आवश्यकता है।'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full"
            >
              <Heart className="w-5 h-5 mr-2" />
              {getText('Make a Donation', 'दान करें')}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full"
            >
              {getText('Volunteer with Us', 'हमारे साथ स्वयंसेवक बनें')}
            </Button>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="text-center mt-16 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-8 border border-orange-200 shadow-lg">
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-relaxed">
                {getText(
                  '"Service is the highest dharma; compassion is the truest wealth"',
                  '"सेवा परमो धर्म: करुणा ही सच्चा धन है"'
                )}
              </p>
              <p className="text-xl md:text-2xl text-gray-600 font-medium">
                {getText(
                  '"सेवा परमो धर्म: करुणा ही सच्चा धन है"',
                  '"Service is the highest dharma; compassion is the truest wealth"'
                )}
              </p>
              <div className="flex items-center justify-center mt-6">
                <Heart className="w-8 h-8 text-orange-500 mr-2" />
                <span className="text-orange-600 font-semibold">
                  {getText('~ Ancient Wisdom', '~ प्राचीन ज्ञान')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {selectedOrganization && (
        <DonationModal
          organization={selectedOrganization}
          onClose={() => setSelectedOrganization(null)}
        />
      )}
    </div>
  );
};

export default Donation;