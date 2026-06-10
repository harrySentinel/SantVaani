import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData, { BreadcrumbSchema } from '@/components/StructuredData';
import { useLanguage } from '@/contexts/LanguageContext';

const team = [
  {
    name: "Aditya Srivastava",
    title: "Founder & Developer",
    role: "A devotee and software engineer who built SantVaani to bring the wisdom of saints closer to every heart.",
    image: "/profie.jpg"
  },
  {
    name: "Arpita Patwa",
    title: "Admin",
    role: "The heart behind our operations, ensuring the community is nurtured with care and devotion.",
    image: ""
  }
];

const values = [
  {
    symbol: "॥",
    title: "Love & Devotion",
    titleHi: "प्रेम और भक्ति",
    description: "We believe love is the highest path to divine realization — the foundation of every word on this platform."
  },
  {
    symbol: "॥",
    title: "Universal Wisdom",
    titleHi: "सार्वभौमिक ज्ञान",
    description: "The teachings of our saints have no borders. They speak to every soul, in every language, across every age."
  },
  {
    symbol: "॥",
    title: "Preservation",
    titleHi: "संरक्षण",
    description: "Sacred wisdom is a flame. We exist to ensure it is never extinguished — passed gently to every generation."
  },
  {
    symbol: "॥",
    title: "Community",
    titleHi: "समुदाय",
    description: "A seeker walking alone walks slowly. Together, our community walks toward the light with strength."
  }
];

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Santvaani - Our Mission & Vision"
        description="Learn about Santvaani's mission to preserve and share the profound wisdom of India's greatest spiritual masters. Meet our team and discover our vision for a global spiritual community."
        canonical="https://santvaani.com/about"
        keywords="about santvaani, spiritual platform, Indian saints, spiritual wisdom, our mission, spiritual community, digital ashram"
      />
      <StructuredData type="organization" />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://santvaani.com' },
          { name: 'About', url: 'https://santvaani.com/about' }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-orange-50/60 to-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-5xl">ॐ</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {language === 'HI' ? 'संतवाणी के बारे में' : 'About SantVaani'}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            {language === 'HI'
              ? 'एक डिजिटल आश्रम — जहाँ भारत के महान संतों की वाणी आज भी जीवित है।'
              : 'A digital ashram — where the voice of India\'s greatest saints still lives.'
            }
          </p>
          <div className="w-16 h-0.5 bg-orange-400 mx-auto mt-4" />
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {language === 'HI' ? 'यह कहानी कैसे शुरू हुई' : 'How this story began'}
          </h2>
          <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
            <p>
              {language === 'HI'
                ? 'SantVaani का जन्म एक साधारण इच्छा से हुआ — कि भारत के महान संतों का ज्ञान, जो हमारे घरों और मंदिरों में बोला जाता था, आज की पीढ़ी तक पहुँचे। वो ज्ञान जो दादी-नानी की कहानियों में था, जो भजनों में था — वो कहीं खो न जाए।'
                : 'SantVaani began with one simple wish — that the wisdom spoken in our homes, temples, and by our grandmothers would not be lost to time. The kind of wisdom found in bhajans, in stories told at dusk, in the quiet teachings of saints who asked nothing in return.'
              }
            </p>
            <p>
              {language === 'HI'
                ? 'आज की दुनिया तेज़ है। लेकिन हमारे संतों का संदेश शांत है — और वही शांति हर इंसान ढूंढता है। SantVaani उस शांति को, उस ज्ञान को, डिजिटल दुनिया में ले आया है।'
                : 'The world moves fast. But the message of our saints is still — and that stillness is what every soul seeks. SantVaani brings that stillness, that wisdom, into the digital world.'
              }
            </p>
            <p>
              {language === 'HI'
                ? 'यह केवल एक वेबसाइट नहीं है। यह एक आश्रम है — जहाँ आप किसी भी समय, कहीं से भी, आ सकते हैं।'
                : 'This is not just a website. It is an ashram — one you can walk into at any hour, from anywhere in the world.'
              }
            </p>
          </div>

          {/* Sanskrit quote */}
          <div className="border-l-4 border-orange-400 pl-6 py-2 mt-8">
            <p className="text-xl md:text-2xl text-gray-800 font-medium italic">
              "वसुधैव कुटुम्बकम्"
            </p>
            <p className="text-orange-600 mt-2 text-base">
              The world is one family — our guiding principle
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Our Mission</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'हमारा लक्ष्य' : 'What we are here to do'}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {language === 'HI'
                ? 'भारत की आध्यात्मिक विरासत को संरक्षित करना और इसे आधुनिक साधकों तक पहुँचाना — यही हमारा उद्देश्य है। हम मानते हैं कि संतों का ज्ञान किसी एक युग का नहीं, यह सनातन है।'
                : 'To preserve India\'s spiritual heritage and make it accessible to every modern seeker. The wisdom of our saints does not belong to one era — it is eternal, and it belongs to everyone.'
              }
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Our Vision</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'हमारी दृष्टि' : 'Where we are going'}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {language === 'HI'
                ? 'एक ऐसा वैश्विक समुदाय बनाना जहाँ आध्यात्मिक ज्ञान स्वतंत्र रूप से बहे — जहाँ भाषा, संस्कृति या देश की कोई सीमा न हो।'
                : 'A global community where spiritual wisdom flows freely — where no boundary of language, culture, or geography can stop a seeker from finding the light.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">What we stand for</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'हमारे मूल मूल्य' : 'Our Core Values'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'HI' ? value.titleHi : value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">The people</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'टीम से मिलें' : 'Meet the team'}
            </h2>
            <p className="text-gray-500 text-lg">
              {language === 'HI'
                ? 'SantVaani एक छोटी, समर्पित टीम द्वारा श्रद्धा के साथ बनाई गई है।'
                : 'SantVaani is built by a small, devoted team — with reverence, not resources.'
              }
            </p>
          </div>

          <div className="space-y-8">
            {team.map((member, index) => (
              <div key={index} className="flex items-start gap-5">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-orange-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex-shrink-0 bg-orange-50 border-2 border-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-orange-500 text-sm font-medium">{member.title}</p>
                  <p className="text-gray-500 leading-relaxed">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Grandmother Tribute */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50/40 to-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">

          {/* Photo placeholder — replace src with real photo when ready */}
          <div className="flex justify-center">
            <div className="relative inline-block">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-amber-300" />
              {/* Circle */}
              <div className="w-32 h-32 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center overflow-hidden shadow-lg"
                style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)' }}>
                {/* Replace with <img src="/grandma.jpg" className="w-full h-full object-cover" alt="Vimla Srivastava" /> once photo is ready */}
                <span className="text-5xl">🙏</span>
              </div>
              {/* Diya sitting at the bottom of the circle */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <span className="text-2xl animate-pulse">🪔</span>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <p className="text-sm text-amber-600 font-semibold uppercase tracking-widest">In Loving Memory</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Vimla Srivastava</h2>
            <p className="text-gray-400 text-sm">With all due respect and love</p>
          </div>

          {/* Radhasoami */}
          <div className="py-4">
            <p className="text-2xl md:text-3xl font-medium text-amber-700 italic tracking-wide">
              " Radhasoami "
            </p>
            <p className="text-gray-400 text-sm mt-2">Her words. Her faith. Her way of life.</p>
          </div>

          {/* Tribute text */}
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed text-left">
            <p>
              She was the iron lady of our home — a woman whose strength was quiet, whose love was boundless,
              and whose faith in God never wavered for a single moment.
            </p>
            <p>
              From her, I learned that you never give up. Not when it is hard, not when it hurts,
              not when the world feels heavy. She never did — and that lesson lives in every page of SantVaani.
            </p>
            <p>
              She always believed in God. And in a way, SantVaani is the fruit of that belief —
              a small offering to the divine she spent her whole life devoted to.
            </p>
            <p>
              Her last word was the name of Bhagwan. There is no more beautiful way to leave this world.
            </p>
          </div>

          {/* Divider */}
          <div className="w-12 h-0.5 bg-amber-300 mx-auto" />

          {/* Thank you */}
          <div className="space-y-2">
            <p className="text-gray-500 text-base italic">
              Thank you for reading this.
            </p>
            <p className="text-amber-600 font-medium text-lg">
              You are a kind heart. 🙏
            </p>
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-orange-50/50">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-4xl">🙏</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {language === 'HI' ? 'यात्रा में शामिल हों' : 'Walk with us'}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            {language === 'HI'
              ? 'चाहे आप पहली बार आध्यात्मिक मार्ग पर कदम रख रहे हों, या वर्षों से इस पथ पर हों — SantVaani आपका स्वागत करता है।'
              : 'Whether you are taking your first steps on a spiritual path or walking it for years — SantVaani welcomes you, exactly as you are.'
            }
          </p>
          <div className="border-l-4 border-orange-400 pl-6 py-1 text-left max-w-lg mx-auto">
            <p className="text-lg text-gray-700 italic font-medium">
              "सत्संग से ही सत्य की प्राप्ति होती है"
            </p>
            <p className="text-orange-500 mt-1 text-sm">
              Truth is found in the company of the wise
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href="/saints"
              className="inline-flex items-center justify-center px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-base font-medium transition-colors"
            >
              Explore the Saints
            </a>
            <a
              href="/bhajans"
              className="inline-flex items-center justify-center px-7 py-3 border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-full text-base font-medium transition-colors"
            >
              Listen to Bhajans
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
