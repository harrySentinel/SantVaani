-- Convert existing plain text blog content to HTML format
-- This wraps plain text paragraphs in <p> tags so they display properly

DO $$
DECLARE
  blog_record RECORD;
  new_content TEXT;
  paragraph TEXT;
  paragraphs TEXT[];
BEGIN
  -- Loop through all blog posts
  FOR blog_record IN
    SELECT id, content
    FROM blog_posts
    WHERE content NOT LIKE '%<p>%' -- Only process posts without HTML tags
  LOOP
    -- Split content by double newlines (paragraph breaks)
    paragraphs := regexp_split_to_array(blog_record.content, E'\\n\\n+');

    -- Initialize new content
    new_content := '';

    -- Wrap each paragraph in <p> tags
    FOREACH paragraph IN ARRAY paragraphs
    LOOP
      IF trim(paragraph) != '' THEN
        -- Replace single newlines with <br> within paragraphs
        paragraph := regexp_replace(trim(paragraph), E'\\n', '<br>', 'g');
        new_content := new_content || '<p>' || paragraph || '</p>' || E'\\n';
      END IF;
    END LOOP;

    -- Update the blog post with HTML content
    UPDATE blog_posts
    SET content = new_content
    WHERE id = blog_record.id;

    RAISE NOTICE 'Converted blog post: %', blog_record.id;
  END LOOP;

  RAISE NOTICE '✅ Plain text to HTML conversion completed!';
END $$;
