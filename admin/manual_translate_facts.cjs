const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Manual translations - Add Hindi translations here
const translations = {
  // Example format:
  // "English text here": "हिंदी अनुवाद यहाँ",

  // Ramayana facts
  "In the Ramayana, Hanuman's heart contains an image of Rama and Sita, discovered when his chest was opened by the gods to verify his devotion.": "रामायण में, हनुमान के हृदय में राम और सीता की छवि है, जो उनकी भक्ति को सत्यापित करने के लिए देवताओं द्वारा उनकी छाती खोले जाने पर खोजी गई।",

  // Mahabharata facts
  "The Mahabharata mentions that Krishna lifted Govardhan hill for 7 days straight, protecting the villagers from Indra's torrential rains.": "महाभारत में उल्लेख है कि कृष्ण ने लगातार 7 दिनों तक गोवर्धन पर्वत को उठाया, ग्रामीणों को इंद्र की मूसलधार बारिश से बचाया।",

  // Hindu Deities facts
  "Lord Ganesha wrote the entire Mahabharata as Sage Vyasa dictated it, breaking his tusk to use as a pen when his original one broke.": "भगवान गणेश ने संपूर्ण महाभारत को महर्षि व्यास के कहे अनुसार लिखा, जब उनकी मूल कलम टूट गई तो अपना दांत तोड़कर कलम के रूप में इस्तेमाल किया।",

  // Add more translations here as you get them translated...
};

async function exportFactsForTranslation() {
  try {
    console.log('🚀 Exporting facts for translation...');

    // Fetch all facts that don't have Hindi translation
    const { data: facts, error } = await supabase
      .from('spiritual_facts')
      .select('id, text, text_hi, category')
      .or('text_hi.is.null,text_hi.eq.""')
      .order('category, id');

    if (error) {
      console.error('Error fetching facts:', error);
      return;
    }

    console.log(`📊 Found ${facts.length} facts to translate\n`);
    console.log('📋 Copy the facts below and get them translated to Hindi:');
    console.log('=' .repeat(80));

    facts.forEach((fact, index) => {
      console.log(`\n${index + 1}. [${fact.category}]`);
      console.log(`EN: ${fact.text}`);
      console.log(`HI: [TRANSLATE THIS]`);
      console.log('-'.repeat(40));
    });

    console.log('\n✨ Instructions:');
    console.log('1. Copy the English texts above');
    console.log('2. Get them translated to Hindi (use Google Translate, human translator, or AI)');
    console.log('3. Add the translations to the "translations" object in manual_translate_facts.js');
    console.log('4. Run: npm run update-translations');

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

async function updateTranslations() {
  try {
    console.log('🚀 Starting manual translation updates...');

    let updated = 0;
    let notFound = 0;

    for (const [englishText, hindiText] of Object.entries(translations)) {
      try {
        // Find the fact by English text
        const { data: facts, error } = await supabase
          .from('spiritual_facts')
          .select('id, text')
          .eq('text', englishText);

        if (error) {
          console.error('Error finding fact:', error);
          continue;
        }

        if (facts && facts.length > 0) {
          // Update with Hindi translation
          const { error: updateError } = await supabase
            .from('spiritual_facts')
            .update({ text_hi: hindiText })
            .eq('id', facts[0].id);

          if (updateError) {
            console.error('Error updating fact:', updateError);
          } else {
            updated++;
            console.log(`✅ Updated: ${englishText.substring(0, 50)}...`);
          }
        } else {
          notFound++;
          console.log(`❌ Not found: ${englishText.substring(0, 50)}...`);
        }

      } catch (error) {
        console.error('Error processing translation:', error);
      }
    }

    console.log(`\n📈 Translation Update Summary:`);
    console.log(`✅ Successfully updated: ${updated} facts`);
    console.log(`❌ Not found: ${notFound} facts`);
    console.log('🎉 Manual translation update completed!');

  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

// Check command line argument
const command = process.argv[2];

if (command === 'export') {
  exportFactsForTranslation();
} else if (command === 'update') {
  updateTranslations();
} else {
  console.log('Usage:');
  console.log('  node manual_translate_facts.js export  - Export facts for translation');
  console.log('  node manual_translate_facts.js update  - Update facts with translations');
}