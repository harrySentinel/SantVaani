const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple translation function using Google Translate API or similar
async function translateToHindi(text) {
  try {
    // You can replace this with Google Translate API, Azure Translator, or any translation service
    // For now, using a simple fetch to a free translation service
    const response = await fetch('https://api.mymemory.translated.net/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: new URLSearchParams({
        q: text,
        langpair: 'en|hi',
        de: 'your-email@example.com' // Replace with your email
      })
    });

    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

// Better option: Use OpenAI or similar AI service for more accurate spiritual translation
async function translateWithAI(text) {
  try {
    // Replace with your preferred AI service (OpenAI, Claude, etc.)
    // This is a placeholder - you'll need to implement your chosen service
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert translator specializing in Hindu spiritual texts. Translate the following English spiritual fact to Hindi, maintaining the spiritual context and cultural accuracy. Return only the Hindi translation.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error('AI Translation error:', error);
    return text;
  }
}

async function bulkTranslateFacts() {
  try {
    console.log('🚀 Starting bulk translation of spiritual facts...');

    // Fetch all facts that don't have Hindi translation
    const { data: facts, error } = await supabase
      .from('spiritual_facts')
      .select('id, text, text_hi')
      .or('text_hi.is.null,text_hi.eq.""')
      .limit(200);

    if (error) {
      console.error('Error fetching facts:', error);
      return;
    }

    console.log(`📊 Found ${facts.length} facts to translate`);

    let translated = 0;
    let errors = 0;

    for (const fact of facts) {
      try {
        console.log(`\n🔄 Translating fact ${translated + 1}/${facts.length}...`);
        console.log(`📝 Original: ${fact.text.substring(0, 50)}...`);

        // Use AI translation (recommended) or simple translation
        const hindiText = await translateWithAI(fact.text);
        // const hindiText = await translateToHindi(fact.text); // Alternative

        console.log(`🌐 Hindi: ${hindiText.substring(0, 50)}...`);

        // Update the database
        const { error: updateError } = await supabase
          .from('spiritual_facts')
          .update({ text_hi: hindiText })
          .eq('id', fact.id);

        if (updateError) {
          console.error(`❌ Error updating fact ${fact.id}:`, updateError);
          errors++;
        } else {
          translated++;
          console.log(`✅ Successfully translated fact ${fact.id}`);
        }

        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error processing fact ${fact.id}:`, error);
        errors++;
      }
    }

    console.log('\n📈 Translation Summary:');
    console.log(`✅ Successfully translated: ${translated} facts`);
    console.log(`❌ Errors: ${errors} facts`);
    console.log('🎉 Bulk translation completed!');

  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

// Run the bulk translation
bulkTranslateFacts();