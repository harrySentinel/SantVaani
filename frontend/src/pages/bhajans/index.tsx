import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BhajanModal from '@/components/BhajanModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Heart, Quote, Music } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

interface Bhajan {
  id: number;
  title: string;
  titleHi: string;
  category: string;
  lyrics: string;
  lyricsHi: string;
  meaning: string;
  author: string;
}

interface QuoteItem {
  id: number;
  text: string;
  textHi: string;
  author: string;
  category: string;
}

const Bhajans = () => {
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleBhajanClick = (bhajan: Bhajan) => {
    console.log('Bhajan clicked:', bhajan.title);
    setSelectedBhajan(bhajan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedBhajan(null);
  };

  const bhajans: Bhajan[] = [
    {
      id: 1,
      title: "Hare Krishna Mahamantra",
      titleHi: "हरे कृष्ण महामंत्र",
      category: "Krishna",
      lyrics: `Hare Krishna Hare Krishna
Krishna Krishna Hare Hare
Hare Rama Hare Rama
Rama Rama Hare Hare

(Repeat continuously with devotion)

This sixteen-word mantra is especially meant for counteracting the ill effects of the present Age of Kali. In this Age of Quarrel and Hypocrisy the holy name of the Lord is the incarnation of the Lord. Simply by chanting this mantra, one can attain the same spiritual results as were attained in previous ages by meditation and elaborate ritualistic ceremonies.`,
      lyricsHi: `हरे कृष्ण हरे कृष्ण
कृष्ण कृष्ण हरे हरे
हरे राम हरे राम
राम राम हरे हरे

(भक्ति के साथ निरंतर जाप करें)

यह सोलह शब्दों का मंत्र विशेष रूप से वर्तमान कलियुग के दुष्प्रभावों का प्रतिकार करने के लिए है। इस कलह और पाखंड के युग में भगवान का पवित्र नाम ही भगवान का अवतार है।`,
      meaning: "The great mantra for liberation, calling upon the divine names of Krishna and Rama. 'Hare' refers to the divine energy, Krishna means 'the all-attractive one,' and Rama means 'the reservoir of all pleasure.' This mantra purifies consciousness and connects the soul with the Supreme.",
      author: "Vedic Tradition"
    },
    {
      id: 2,
      title: "Hanuman Chalisa",
      titleHi: "हनुमान चालीसा",
      category: "Hanuman",
      lyrics: `Shri Guru Charan Saroj Raj
Nij Man Mukur Sudhari
Barnau Raghuvar Bimal Jasu
Jo Dayaku Phal Chari

Buddhiheen Tanu Janike
Sumirau Pavan Kumar
Bal Buddhi Vidya Dehu Mohi
Harahu Kalesh Vikar

Jai Hanuman Gyan Gun Sagar
Jai Kapis Tihun Lok Ujagar
Ram Doot Atulit Bal Dhama
Anjani Putra Pavan Sut Nama

Mahabir Bikram Bajrangi
Kumati Nivaar Sumati Ke Sangi
Kanchan Baran Biraaj Subesa
Kanan Kundal Kunchit Kesha`,
      lyricsHi: `श्री गुरु चरन सरोज रज
निज मन मुकुर सुधारि
बरनउं रघुबर बिमल जसु
जो दायकु फल चारि

बुद्धिहीन तनु जानिके
सुमिरउं पवन कुमार
बल बुद्धि विद्या देहु मोहि
हरहु कलेश बिकार

जय हनुमान ज्ञान गुन सागर
जय कपीस तिहुं लोक उजागर
राम दूत अतुलित बल धामा
अंजनि पुत्र पवन सुत नामा

महाबीर बिक्रम बजरंगी
कुमति निवार सुमति के संगी
कंचन बरन बिराज सुबेसा
कानन कुंडल कुंचित केसा`,
      meaning: "Cleansing the mirror of my mind with the dust of lotus feet of my Guru, I narrate the pure fame of Shri Raghuvar which gives the four fruits of dharma, artha, kama and moksha. Victory to Hanuman, the ocean of wisdom and virtue, the messenger of Ram endowed with immeasurable strength.",
      author: "Tulsidas"
    },
    {
      id: 3,
      title: "Om Namah Shivaya",
      titleHi: "ॐ नमः शिवाय",
      category: "Shiva",
      lyrics: `Om Namah Shivaya
Om Namah Shivaya
Shivaya Namah Om
Shivaya Namah Om

Namah Shivaya Om Namah Shivaya
Om Namah Shivaya Om Namah Shivaya
Shivaya Namah Om Shivaya Namah Om
Shivaya Namah Om Shivaya Namah Om

(Chant with each breath, feeling the divine presence of Shiva)

This five-syllable mantra (excluding Om) is one of the most sacred mantras in Hinduism. Each syllable represents one of the five elements:
Na - Earth
Ma - Water  
Shi - Fire
Va - Air
Ya - Space`,
      lyricsHi: `ॐ नमः शिवाय
ॐ नमः शिवाय
शिवाय नमः ॐ
शिवाय नमः ॐ

नमः शिवाय ॐ नमः शिवाय
ॐ नमः शिवाय ॐ नमः शिवाय
शिवाय नमः ॐ शिवाय नमः ॐ
शिवाय नमः ॐ शिवाय नमः ॐ

(प्रत्येक सांस के साथ जाप करें, शिव की दिव्य उपस्थिति को महसूस करते हुए)

यह पंचाक्षर मंत्र हिंदू धर्म के सबसे पवित्र मंत्रों में से एक है।`,
      meaning: "Salutations to Shiva, the auspicious one, the destroyer of negativity and transformer of consciousness. This mantra purifies the five elements within us and connects us to the cosmic consciousness. It represents surrender to the divine and invokes Shiva's blessings for spiritual awakening.",
      author: "Ancient Tradition"
    },
    {
      id: 4,
      title: "Gayatri Mantra",
      titleHi: "गायत्री मंत्र",
      category: "Universal",
      lyrics: `Om Bhur Bhuvaḥ Swaḥ
Tat Savitur Vareṇyaṃ
Bhargo Devasya Dhīmahi
Dhiyo Yo Naḥ Prachodayāt

Translation:
Om - The primordial sound
Bhur - Earth/Physical plane
Bhuvaḥ - Atmosphere/Mental plane  
Swaḥ - Heaven/Spiritual plane
Tat - That (referring to the divine)
Savitur - Of the Sun/Divine light
Vareṇyaṃ - Adorable/Most excellent
Bhargo - Effulgence/Spiritual light
Devasya - Divine
Dhīmahi - We meditate upon
Dhiyo - Intellect/Understanding
Yo - Who/Which
Naḥ - Our
Prachodayāt - May inspire/guide

Chant during sunrise for maximum spiritual benefit.`,
      lyricsHi: `ॐ भूर्भुवः स्वः
तत्सवितुर्वरेण्यं
भर्गो देवस्य धीमahi
धियो यो नः प्रचोदयात्

अर्थ:
ॐ - प्रणव ध्वनि
भूर् - पृथ्वी/भौतिक लोक
भुवः - आकाश/मानसिक लोक
स्वः - स्वर्ग/आध्यात्मिक लोक
तत् - वह (परमात्मा)
सवितुर् - सूर्य/दिव्य प्रकाश का
वरेण्यं - श्रेष्ठ/पूजनीय
भर्गो - तेज/आध्यात्मिक प्रकाश
देवस्य - दिव्य
धीमahi - हम ध्यान करते हैं
धियो - बुद्धि/समझ
यो - जो
नः - हमारी
प्रचोदयात् - प्रेरणा दे/मार्गदर्शन करे`,
      meaning: "We meditate on the divine light that illuminates the three worlds (physical, mental, spiritual) and guides our intellect toward truth and righteousness. This universal prayer seeks divine guidance for wisdom and spiritual illumination. It is considered the mother of all mantras.",
      author: "Sage Vishwamitra"
    },
    {
      id: 5,
      title: "Govind Bolo Hari Gopal Bolo",
      titleHi: "गोविंद बोलो हरि गोपाल बोलो",
      category: "Krishna",
      lyrics: `Govind Bolo Hari Gopal Bolo
Radha Ramana Hari Govind Bolo
Govind Bolo Hari Gopal Bolo
Radha Ramana Hari Govind Bolo

Gopala Gopala Govinda Gopala
Radha Vallabha Gopala
Gopala Gopala Govinda Gopala  
Radha Vallabha Gopala

Hare Krishna Hare Krishna
Krishna Krishna Hare Hare
Hare Rama Hare Rama
Rama Rama Hare Hare

Govinda Jaya Jaya Gopala Jaya Jaya
Radha Ramana Hari Govinda Jaya Jaya
Govinda Jaya Jaya Gopala Jaya Jaya
Radha Ramana Hari Govinda Jaya Jaya`,
      lyricsHi: `गोविंद बोलो हरि गोपाल बोलो
राधा रमणा हरि गोविंद बोलो
गोविंद बोलो हरि गोपाल बोलो
राधा रमणा हरि गोविंद बोलो

गोपाल गोपाल गोविंद गोपाल
राधा वल्लभ गोपाल
गोपाल गोपाल गोविंद गोपाल
राधा वल्लभ गोपाल

हरे कृष्ण हरे कृष्ण
कृष्ण कृष्ण हरे हरे
हरे राम हरे राम
राम राम हरे हरे

गोविंद जय जय गोपाल जय जaya
राधा रमणा हरि गोविंद जaya जaya
गोविंद जaya जaya गोपाल जaya जaya
राधा रमणा हरि गोविंद जaya जaya`,
      meaning: "Chant the names of Govind (protector of cows and souls), Hari (one who removes suffering), and Gopal (protector of cows). Radha Ramana refers to Krishna as the beloved of Radha. This bhajan celebrates the divine love between Radha and Krishna, symbolizing the soul's longing for union with the divine.",
      author: "Traditional Bhajan"
    },
    {
      id: 6,
      title: "Raghupati Raghav Raja Ram",
      titleHi: "रaghुपति राघव राजा राम",
      category: "Rama",
      lyrics: `Raghupati Raghav Raja Ram
Patit Pavan Sita Ram
Raghupati Raghav Raja Ram
Patit Pavan Sita Ram

Ishwar Allah Tere Naam
Sabko Sanmati De Bhagwan
Ishwar Allah Tere Naam
Sabko Sanmati De Bhagwan

Raghupati Raghav Raja Ram
Patit Pavan Sita Ram
Sita Ram Jay Sita Ram
Bol Pyare Tu Sita Ram

Ram Raheem Karim Rahman
Sab Mil Bolo Bhagwan
Ram Raheem Karim Rahman  
Sab Mil Bolo Bhagwan

(This bhajan promotes unity among all religions and communities)`,
      lyricsHi: `रaghुपति राघव राजा राम
पतित पावन सीता राम
रaghupati राघव राजा राम
पतित पावन सीता राम

ईश्वर अल्लाह तेरे नाम
सबको सन्मति दे भगवान
ईश्वर अल्लाह तेरे नाम
सबको सन्मति दे भगवान

रaghupati राघव राजा राम
पतित पावन सीता राम
सीता राम जय सीता राम
बोल प्यारे तू सीता राम

राम रहीम करीम रहमान
सब मिल बोलो भगवान
राम रहीम करीम रहमान
सब मिल बोलो भगवान`,
      meaning: "Raghupati (descendant of Raghu), Raghav (Rama), the king among kings, the purifier of the fallen, along with Sita. Whether you call the divine Ishwar or Allah, they are the same. May the divine grant good wisdom to all. This bhajan emphasizes the unity of all religions and the universal nature of divine truth.",
      author: "Traditional - Popularized by Mahatma Gandhi"
    }
  ];

  const quotes: QuoteItem[] = [
    {
      id: 1,
      text: "The soul is neither born, and nor does it die",
      textHi: "न जायते म्रियते वा कदाचित्",
      author: "Bhagavad Gita",
      category: "Eternal Truth"
    },
    {
      id: 2,
      text: "Where there is dharma, there is victory",
      textHi: "यतो धर्मस्ततो जयः",
      author: "Mahabharata",
      category: "Dharma"
    },
    {
      id: 3,
      text: "Love is the bridge between you and everything",
      textHi: "प्रेम तुम्हारे और सब कुछ के बीच का सेतु है",
      author: "Rumi",
      category: "Love"
    },
    {
      id: 4,
      text: "The guru is the beginning, the guru is the end",
      textHi: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः",
      author: "Guru Stotram",
      category: "Guru"
    },
    {
      id: 5,
      text: "Truth alone triumphs, not falsehood",
      textHi: "सत्यमेव जयते नानृतम्",
      author: "Mundaka Upanishad",
      category: "Truth"
    },
    {
      id: 6,
      text: "In devotion, the devotee and the beloved become one",
      textHi: "भक्ति में भक्त और भगवान एक हो जाते हैं",
      author: "Saint Tradition",
      category: "Devotion"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-green-500 animate-pulse" />
              <span className="text-3xl">🎵</span>
              <Quote className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Bhajans & Quotes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in sacred melodies and profound wisdom through our collection of 
              devotional songs and inspiring spiritual quotes from the great masters.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2">
                {bhajans.length} Sacred Songs
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                {quotes.length} Divine Quotes
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="bhajans" className="space-y-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="bhajans" className="flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Bhajans</span>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center space-x-2">
                <Quote className="w-4 h-4" />
                <span>Quotes</span>
              </TabsTrigger>
            </TabsList>

            {/* Bhajans Tab */}
            <TabsContent value="bhajans" className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">Sacred Bhajans</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Devotional songs that have echoed through temples and hearts for centuries, 
                  carrying the divine vibrations of love and surrender.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {bhajans.map((bhajan) => (
                  <Card 
                    key={bhajan.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm cursor-pointer"
                    onClick={() => handleBhajanClick(bhajan)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                            {bhajan.title}
                          </h3>
                          <p className="text-sm text-green-600 font-medium">
                            {bhajan.titleHi}
                          </p>
                          <Badge variant="outline" className="border-green-200 text-green-600">
                            {bhajan.category}
                          </Badge>
                        </div>
                        <Music className="w-6 h-6 text-green-500" />
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-lg p-4 border border-green-100">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <div className="space-y-2">
                            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-medium leading-relaxed line-clamp-3">
                              {bhajan.lyrics.split('\n').slice(0, 4).join('\n')}...
                            </pre>
                            <pre className="text-sm text-green-600 whitespace-pre-wrap font-medium leading-relaxed line-clamp-3">
                              {bhajan.lyricsHi.split('\n').slice(0, 4).join('\n')}...
                            </pre>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Meaning:</p>
                          <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-2">
                            {bhajan.meaning}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-gray-500">- {bhajan.author}</p>
                          <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">Read Full</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">Divine Wisdom</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Timeless words of wisdom from enlightened masters, scriptures, and saints 
                  that illuminate the path to spiritual awakening.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotes.map((quote) => (
                  <Card key={quote.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4 h-full flex flex-col">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="border-orange-200 text-orange-600">
                          {quote.category}
                        </Badge>
                        <Quote className="w-5 h-5 text-orange-500" />
                      </div>

                      <div className="flex-grow space-y-3">
                        <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                          "{quote.text}"
                        </blockquote>
                        
                        <p className="text-base text-orange-600 font-medium">
                          "{quote.textHi}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">- {quote.author}</p>
                        <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Daily Inspiration */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Daily Spiritual Nourishment
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Let these sacred sounds and words be your daily companions on the spiritual journey. 
              Each bhajan and quote carries the power to transform the heart and elevate consciousness.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "संगीत ही सबसे बड़ा धर्म है"
            </blockquote>
            <p className="text-lg text-green-600 mt-2">
              "Music is the greatest religion"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
              <Book className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Daily Bhajan</h3>
              <p className="text-sm text-gray-600">Start your day with a sacred song</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <Quote className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Quote of the Day</h3>
              <p className="text-sm text-gray-600">Wisdom to guide your spiritual practice</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              Saints' Teachings
            </a>
            <a href="/divine" className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors">
              Divine Forms
            </a>
          </div>
        </div>
      </section>

      {/* Bhajan Modal */}
      <BhajanModal
        bhajan={selectedBhajan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Toast notifications */}
      <Toaster />

      <Footer />
    </div>
  );
};

export default Bhajans;
