-- Migration: Convert old prabhu_leelaayen structure to new books-based structure
-- This drops the old tables and creates the new book library system

-- Step 1: Drop old tables (if they exist)
DROP TABLE IF EXISTS prabhu_leelaayen_bookmarks CASCADE;
DROP TABLE IF EXISTS prabhu_leelaayen_progress CASCADE;
DROP TABLE IF EXISTS prabhu_leelaayen_chapters CASCADE;

-- Drop old function
DROP FUNCTION IF EXISTS increment_chapter_views(VARCHAR);

-- Step 2: Create new books-based structure

-- Books Table (Mahabharat, Ramayan, etc.)
CREATE TABLE IF NOT EXISTS leelaayen_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  description_hi TEXT,
  cover_image TEXT,
  author VARCHAR(255),
  author_hi VARCHAR(255),
  total_chapters INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for books
CREATE INDEX IF NOT EXISTS idx_books_published ON leelaayen_books(published);
CREATE INDEX IF NOT EXISTS idx_books_slug ON leelaayen_books(slug);

-- Chapters Table (belongs to a book)
CREATE TABLE IF NOT EXISTS leelaayen_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES leelaayen_books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  content_hi TEXT NOT NULL,
  chapter_image TEXT,
  read_time INTEGER DEFAULT 10,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chapter_number_positive CHECK (chapter_number > 0),
  UNIQUE(book_id, chapter_number)
);

-- Create index for chapters
CREATE INDEX IF NOT EXISTS idx_chapters_published ON leelaayen_chapters(published);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON leelaayen_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_slug ON leelaayen_chapters(slug);

-- User Reading Progress Table
CREATE TABLE IF NOT EXISTS leelaayen_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  session_id VARCHAR(255),
  book_id UUID REFERENCES leelaayen_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES leelaayen_chapters(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter_id),
  UNIQUE(session_id, book_id, chapter_id)
);

-- Create index for progress
CREATE INDEX IF NOT EXISTS idx_progress_user ON leelaayen_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_session ON leelaayen_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_book ON leelaayen_progress(book_id);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS leelaayen_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  session_id VARCHAR(255),
  book_id UUID REFERENCES leelaayen_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES leelaayen_chapters(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON leelaayen_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_session ON leelaayen_bookmarks(session_id);

-- Functions
CREATE OR REPLACE FUNCTION increment_book_views(book_slug VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE leelaayen_books
  SET views = views + 1
  WHERE slug = book_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_chapter_views(chapter_slug VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE leelaayen_chapters
  SET views = views + 1
  WHERE slug = chapter_slug;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE leelaayen_books IS 'Stores books like Mahabharat, Ramayan, etc.';
COMMENT ON TABLE leelaayen_chapters IS 'Stores chapters for each book';
COMMENT ON TABLE leelaayen_progress IS 'Tracks user reading progress';
COMMENT ON TABLE leelaayen_bookmarks IS 'User bookmarks for favorite passages';

-- Step 3: Insert sample books and chapters

-- Insert Mahabharat
INSERT INTO leelaayen_books (
  title,
  title_hi,
  slug,
  description,
  description_hi,
  author,
  author_hi,
  total_chapters,
  published
) VALUES (
  'Mahabharat',
  'महाभारत',
  'mahabharat',
  'The great epic of ancient India, a tale of dharma, duty, and divine intervention',
  'प्राचीन भारत का महान महाकाव्य, धर्म, कर्तव्य और दिव्य हस्तक्षेप की कहानी',
  'Veda Vyasa',
  'वेद व्यास',
  18,
  true
);

-- Insert Ramayan
INSERT INTO leelaayen_books (
  title,
  title_hi,
  slug,
  description,
  description_hi,
  author,
  author_hi,
  total_chapters,
  published
) VALUES (
  'Ramayan',
  'रामायण',
  'ramayan',
  'The divine story of Lord Rama, his devotion to dharma, and triumph of good over evil',
  'भगवान राम की दिव्य कथा, धर्म के प्रति उनकी भक्ति और बुराई पर अच्छाई की जीत',
  'Valmiki',
  'वाल्मीकि',
  7,
  true
);

-- Insert Bhagavad Gita
INSERT INTO leelaayen_books (
  title,
  title_hi,
  slug,
  description,
  description_hi,
  author,
  author_hi,
  total_chapters,
  published
) VALUES (
  'Bhagavad Gita',
  'भगवद् गीता',
  'bhagavad-gita',
  'Sacred dialogue between Lord Krishna and Arjuna on the battlefield of Kurukshetra',
  'कुरुक्षेत्र के युद्धभूमि पर भगवान कृष्ण और अर्जुन के बीच पवित्र संवाद',
  'Veda Vyasa',
  'वेद व्यास',
  18,
  true
);

-- Insert sample chapter for Mahabharat
INSERT INTO leelaayen_chapters (
  book_id,
  chapter_number,
  title,
  title_hi,
  slug,
  content,
  content_hi,
  read_time,
  published
) VALUES (
  (SELECT id FROM leelaayen_books WHERE slug = 'mahabharat'),
  1,
  'The Beginning',
  'आरम्भ',
  'mahabharat-chapter-1-beginning',
  '<h2>Chapter 1: The Beginning</h2><p>In the ancient land of Bharatavarsha, there lived great kings and warriors whose stories have been told for thousands of years. This is the tale of the Mahabharata, the greatest epic ever written.</p><p>Long ago, in the city of Hastinapura, there ruled King Shantanu, a noble and just ruler. One day, while walking along the banks of the Ganga river, he saw a beautiful woman. Her grace and beauty captivated his heart.</p><p>This was no ordinary woman - she was Ganga herself, the goddess of the sacred river. King Shantanu fell deeply in love with her and asked for her hand in marriage.</p><p>Ganga agreed, but on one condition: "You must never question my actions, no matter what I do. The day you question me will be the day I leave you forever."</p><p>The king, blinded by love, agreed to this strange condition. They were married, and Ganga bore him seven sons. But each time a child was born, Ganga would take the infant to the river and drown him. The king watched in horror but remained silent, bound by his promise.</p><p>When the eighth son was born, the king could bear it no longer. As Ganga prepared to drown the child, he cried out: "Stop! Why are you doing this terrible thing?"</p><p>Ganga looked at him with sad eyes. "You have broken your promise. Now I must leave. But know this - these children were celestial beings cursed to be born as mortals. By drowning them, I freed them from their curse. This eighth child, however, I will spare. He is Devavrata, and he will become the greatest warrior the world has ever known."</p><p>With these words, Ganga disappeared, taking the child with her. Years later, she would return the boy to his father, now a young man of extraordinary strength and wisdom.</p><p>This boy would grow up to be known as Bhishma, and his vow of celibacy would shape the destiny of the entire Kuru dynasty...</p>',
  '<h2>अध्याय 1: आरम्भ</h2><p>भारतवर्ष की प्राचीन भूमि में, महान राजा और योद्धा रहते थे जिनकी कहानियां हजारों वर्षों से सुनाई जा रही हैं। यह महाभारत की कथा है, जो अब तक लिखा गया सबसे महान महाकाव्य है।</p><p>बहुत समय पहले, हस्तिनापुर नगर में राजा शांतनु का शासन था, जो एक महान और न्यायप्रिय राजा थे। एक दिन, गंगा नदी के तट पर टहलते हुए, उन्होंने एक सुंदर स्त्री को देखा। उसकी सुंदरता और लालित्य ने उनका दिल जीत लिया।</p><p>यह कोई साधारण स्त्री नहीं थी - यह स्वयं गंगा थीं, पवित्र नदी की देवी। राजा शांतनु को उनसे गहरा प्रेम हो गया और उन्होंने विवाह का प्रस्ताव रखा।</p><p>गंगा ने स्वीकार कर लिया, लेकिन एक शर्त के साथ: "आप मेरे किसी भी कार्य पर कभी सवाल नहीं उठाएंगे, चाहे मैं कुछ भी करूं। जिस दिन आप मुझसे सवाल करेंगे, उसी दिन मैं आपको हमेशा के लिए छोड़ दूंगी।"</p><p>राजा, प्रेम में अंधे होकर, इस अजीब शर्त को मान गए। उनका विवाह हुआ, और गंगा ने उन्हें सात पुत्र दिए। लेकिन हर बार जब एक बच्चा पैदा होता, गंगा उस शिशु को नदी में ले जाकर डुबो देतीं। राजा भयभीत होकर देखते रहे लेकिन चुप रहे, अपने वचन से बंधे हुए।</p><p>जब आठवां पुत्र पैदा हुआ, राजा और अधिक सहन नहीं कर सके। जब गंगा बच्चे को डुबोने की तैयारी कर रहीं थीं, वे चिल्ला उठे: "रुको! तुम यह भयानक काम क्यों कर रही हो?"</p><p>गंगा ने उदास आँखों से उन्हें देखा। "आपने अपना वचन तोड़ दिया है। अब मुझे जाना होगा। लेकिन यह जान लीजिए - ये बच्चे दिव्य प्राणी थे जो नश्वर रूप में जन्म लेने के लिए शापित थे। उन्हें डुबोकर, मैंने उन्हें उनके शाप से मुक्त किया। हालांकि, इस आठवें बच्चे को मैं बख्श दूंगी। यह देववृत है, और यह दुनिया का सबसे महान योद्धा बनेगा।"</p><p>इन शब्दों के साथ, गंगा गायब हो गईं, बच्चे को अपने साथ ले गईं। वर्षों बाद, वे लड़के को उसके पिता के पास वापस लाईं, अब एक युवक के रूप में जो असाधारण शक्ति और ज्ञान से संपन्न था।</p><p>यह लड़का बड़ा होकर भीष्म के नाम से जाना गया, और उसकी ब्रह्मचर्य की प्रतिज्ञा ने पूरे कुरु वंश की नियति को आकार दिया...</p>',
  15,
  true
);

-- Insert sample chapter for Ramayan
INSERT INTO leelaayen_chapters (
  book_id,
  chapter_number,
  title,
  title_hi,
  slug,
  content,
  content_hi,
  read_time,
  published
) VALUES (
  (SELECT id FROM leelaayen_books WHERE slug = 'ramayan'),
  1,
  'Bala Kanda - The Book of Childhood',
  'बाल काण्ड',
  'ramayan-chapter-1-bala-kanda',
  '<h2>Chapter 1: Bala Kanda</h2><p>In the ancient city of Ayodhya, there ruled a great king named Dasharatha. He was beloved by his people and known for his righteousness and valor. However, despite having three queens, he had no heir to his throne.</p><p>The king performed a great sacrifice called Putrakameshti Yajna, seeking divine intervention for a son. The gods were pleased with his devotion, and Agni, the fire god, appeared from the sacrificial fire carrying a golden vessel filled with divine nectar.</p><p>"Give this to your queens," said Agni, "and you will be blessed with sons who will be the protectors of dharma."</p><p>King Dasharatha divided the divine nectar among his three queens - Kausalya, Kaikeyi, and Sumitra. In due course, they gave birth to four divine sons.</p><p>Kausalya gave birth to Rama, who was the incarnation of Lord Vishnu himself. Kaikeyi bore Bharata, and Sumitra gave birth to twins, Lakshmana and Shatrughna.</p><p>The birth of these four princes filled the kingdom with joy. Divine music played in the heavens, flowers rained from the sky, and all of Ayodhya celebrated.</p><p>As the princes grew, they were trained in all the arts - warfare, politics, philosophy, and dharma. Among them, Rama shone the brightest. His character was flawless, his strength unmatched, and his devotion to dharma absolute.</p><p>Little did anyone know that these four princes were destined to play crucial roles in one of the greatest stories ever told - a tale of love, duty, sacrifice, and the eternal victory of good over evil...</p>',
  '<h2>अध्याय 1: बाल काण्ड</h2><p>प्राचीन अयोध्या नगरी में, महाराज दशरथ का शासन था। वे अपनी प्रजा द्वारा अत्यधिक प्रिय थे और अपनी धार्मिकता और पराक्रम के लिए जाने जाते थे। हालांकि, तीन रानियां होने के बावजूद, उनके पास अपने सिंहासन का कोई उत्तराधिकारी नहीं था।</p><p>राजा ने पुत्रकामेष्टि यज्ञ नामक एक महान यज्ञ किया, पुत्र प्राप्ति के लिए दिव्य हस्तक्षेप की कामना करते हुए। देवता उनकी भक्ति से प्रसन्न हुए, और अग्निदेव यज्ञ की अग्नि से प्रकट हुए, एक स्वर्ण पात्र लेकर जो दिव्य अमृत से भरा था।</p><p>"यह अपनी रानियों को दे दीजिए," अग्निदेव ने कहा, "और आप ऐसे पुत्रों से आशीर्वादित होंगे जो धर्म के रक्षक होंगे।"</p><p>महाराज दशरथ ने दिव्य अमृत को अपनी तीन रानियों - कौशल्या, कैकेयी, और सुमित्रा के बीच बांट दिया। समय आने पर, उन्होंने चार दिव्य पुत्रों को जन्म दिया।</p><p>कौशल्या ने राम को जन्म दिया, जो स्वयं भगवान विष्णु के अवतार थे। कैकेयी ने भरत को जन्म दिया, और सुमित्रा ने जुड़वां पुत्रों, लक्ष्मण और शत्रुघ्न को जन्म दिया।</p><p>इन चार राजकुमारों के जन्म से राज्य में आनंद छा गया। स्वर्ग में दिव्य संगीत बजा, आकाश से फूल बरसे, और पूरे अयोध्या ने उत्सव मनाया।</p><p>जैसे-जैसे राजकुमार बड़े हुए, उन्हें सभी कलाओं में प्रशिक्षित किया गया - युद्धकला, राजनीति, दर्शन, और धर्म। उनमें से, राम सबसे अधिक चमके। उनका चरित्र निष्कलंक था, उनकी शक्ति अतुलनीय थी, और धर्म के प्रति उनकी भक्ति परम थी।</p><p>किसी को पता नहीं था कि ये चार राजकुमार अब तक सुनाई गई सबसे महान कहानियों में से एक में महत्वपूर्ण भूमिका निभाने के लिए नियत थे - प्रेम, कर्तव्य, त्याग, और बुराई पर अच्छाई की शाश्वत विजय की कथा...</p>',
  12,
  true
);

-- Verify the migration
SELECT 'Migration completed successfully!' AS status;

-- Show created tables
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name LIKE 'leelaayen%'
ORDER BY table_name;

-- Show sample books
SELECT title, title_hi, author, total_chapters, published FROM leelaayen_books;
