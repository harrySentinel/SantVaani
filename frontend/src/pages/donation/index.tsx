import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Phone, Mail, Heart, Users, Home, Loader } from 'lucide-react';
import DonationModal from '@/components/DonationModal';
import DonationInstructions from '@/components/DonationInstructions';
import OrganizationSubmissionForm from '@/components/OrganizationSubmissionForm';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Organization {
  id: string;
  organization_name: string;
  organization_name_hi?: string;
  organization_type: string;
  contact_person: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  description?: string;
  description_hi?: string;
  established_year?: number;
  capacity?: number;
  needs?: string[];
  upi_id?: string;
  status: string;
  created_at: string;
}

const Donation = () => {
  const { language } = useLanguage();
  const [selectedType, setSelectedType] = useState<'all' | 'vridh_ashram' | 'orphanage'>('all');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const isHindi = language === 'HI';

  // Fetch approved organizations from backend
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const typeParam = selectedType === 'all' ? '' : `?type=${selectedType}`;
        const response = await axios.get(`${BACKEND_URL}/api/organizations/approved${typeParam}`);

        if (response.data.success) {
          setOrganizations(response.data.organizations);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [selectedType]);

  const getTypeIcon = (type: string) => {
    return type === 'vridh_ashram' ? Users : Home;
  };

  const getTypeColor = (type: string) => {
    return type === 'vridh_ashram' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600';
  };

  const getTypeLabel = (type: string, isHindi: boolean) => {
    const labels: Record<string, { en: string; hi: string }> = {
      vridh_ashram: { en: 'Vridh Ashram', hi: 'वृद्ध आश्रम' },
      orphanage: { en: 'Orphanage', hi: 'अनाथालय' },
      dharamshala: { en: 'Dharamshala', hi: 'धर्मशाला' },
      temple: { en: 'Temple', hi: 'मंदिर' },
      gaushala: { en: 'Gaushala', hi: 'गौशाला' },
      other: { en: 'Other', hi: 'अन्य' }
    };
    return isHindi ? labels[type]?.hi || type : labels[type]?.en || type;
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent pt-2">
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
            {(['all', 'vridh_ashram', 'orphanage'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {type === 'all'
                  ? getText('All Organizations', 'सभी संस्थाएं')
                  : getTypeLabel(type, isHindi)
                }
              </button>
            ))}
          </div>

          {/* Mobile Version */}
          <div className="sm:hidden w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-orange-200">
              <div className="grid grid-cols-1 gap-2">
                {(['all', 'vridh_ashram', 'orphanage'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {type === 'all'
                      ? getText('All Organizations', 'सभी संस्थाएं')
                      : getTypeLabel(type, isHindi)
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="ml-3 text-gray-600">Loading organizations...</span>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {getText('No organizations found. Be the first to register!', 'कोई संगठन नहीं मिला। रजिस्टर करने वाले पहले बनें!')}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {organizations.map((org) => {
              const TypeIcon = getTypeIcon(org.organization_type);
              const location = `${org.city}, ${org.state}`;

              return (
                <Card key={org.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className={`bg-gradient-to-r ${getTypeColor(org.organization_type)} text-white border-0 px-3 py-1`}
                      >
                        <TypeIcon className="w-4 h-4 mr-1" />
                        {getTypeLabel(org.organization_type, isHindi)}
                      </Badge>
                      {org.established_year && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {org.established_year}
                        </div>
                      )}
                    </div>

                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {isHindi && org.organization_name_hi ? org.organization_name_hi : org.organization_name}
                    </CardTitle>
                    {org.organization_name_hi && (
                      <p className="text-sm text-orange-600 font-medium">
                        {isHindi ? org.organization_name : org.organization_name_hi}
                      </p>
                    )}

                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm">{location}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {(org.description || org.description_hi) && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {isHindi && org.description_hi ? org.description_hi : org.description}
                      </p>
                    )}

                    {org.needs && org.needs.length > 0 && (
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
                    )}

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-orange-500" />
                        {org.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-orange-500" />
                        {org.email}
                      </div>
                      {org.capacity && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-orange-500" />
                          {getText('Capacity:', 'क्षमता:')} {org.capacity} {getText('residents', 'निवासी')}
                        </div>
                      )}
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
        )}

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

        {/* How to Donate Instructions */}
        <DonationInstructions />

        {/* Organization Registration Form */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {getText('Register Your Organization', 'अपना संगठन पंजीकृत करें')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {getText(
                'Are you running an ashram, orphanage, or religious organization? Join our network and receive donations through SantVaani platform.',
                'क्या आप आश्रम, अनाथालय या धार्मिक संगठन चला रहे हैं? हमारे नेटवर्क में शामिल हों और संतवाणी प्लेटफॉर्म के माध्यम से दान प्राप्त करें।'
              )}
            </p>
          </div>
          <OrganizationSubmissionForm />
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