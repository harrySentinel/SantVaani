import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust path as needed
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DivineFormModal from '@/components/DivineFormModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Shield, Zap, Loader2 } from 'lucide-react';

const Divine = () => {
  const [selectedDivineForm, setSelectedDivineForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [divineforms, setDivineForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch divine forms from Supabase
  useEffect(() => {
    fetchDivineForms();
  }, []);

  const fetchDivineForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('divine_forms')
        .select('*')
        .order('id');

      if (error) throw error;

      setDivineForms(data || []);
    } catch (error) {
      console.error('Error fetching divine forms:', error);
      setError('Failed to load divine forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDivineFormClick = (form) => {
    setSelectedDivineForm(form);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDivineForm(null);
  };

  const getIconForDomain = (domain) => {
    if (domain.includes('Love') || domain.includes('Grace')) return Sparkles;
    if (domain.includes('Justice') || domain.includes('Wisdom')) return Crown;
    if (domain.includes('Strength') || domain.includes('Protection')) return Shield;
    return Zap;
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
            <p className="text-lg text-gray-600">Loading divine forms...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-lg text-gray-600">{error}</p>
            <button 
              onClick={fetchDivineForms}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                      src={form.image_url} 
                      alt={form.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                        {form.name_hi}
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