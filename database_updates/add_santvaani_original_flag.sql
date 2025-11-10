-- Add SantVaani Original flag to books
-- This allows marking exclusive content created by SantVaani

-- Add column to leelaayen_books table
ALTER TABLE public.leelaayen_books
ADD COLUMN IF NOT EXISTS is_santvaani_original BOOLEAN DEFAULT FALSE;

-- Add index for filtering original content
CREATE INDEX IF NOT EXISTS idx_leelaayen_books_original
ON public.leelaayen_books(is_santvaani_original);

-- Update comment
COMMENT ON COLUMN public.leelaayen_books.is_santvaani_original IS
'Flag to indicate if this is exclusive SantVaani original content';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ SantVaani Original flag added successfully!';
  RAISE NOTICE '📚 You can now mark books as exclusive SantVaani content';
END $$;
