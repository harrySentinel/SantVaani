import { useState } from 'react'
import { marked } from 'marked'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { FileText, Sparkles, Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MarkdownConverterProps {
  isOpen: boolean
  onClose: () => void
  onConvert: (html: string) => void
}

export default function MarkdownConverter({ isOpen, onClose, onConvert }: MarkdownConverterProps) {
  const [markdown, setMarkdown] = useState('')
  const [preview, setPreview] = useState('')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Configure marked to match our blog styling
  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
  })

  const handleConvert = () => {
    try {
      const html = marked(markdown) as string
      setPreview(html)

      toast({
        title: 'Converted!',
        description: 'Markdown has been converted to HTML successfully'
      })
    } catch (error) {
      toast({
        title: 'Conversion failed',
        description: 'Please check your Markdown syntax',
        variant: 'destructive'
      })
    }
  }

  const handleUseHTML = () => {
    if (!preview) {
      toast({
        title: 'Nothing to convert',
        description: 'Please convert Markdown first',
        variant: 'destructive'
      })
      return
    }

    onConvert(preview)
    setMarkdown('')
    setPreview('')
    onClose()

    toast({
      title: 'Success!',
      description: 'HTML loaded into editor. You can now edit and save!'
    })
  }

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(preview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: 'Copied!',
      description: 'HTML copied to clipboard'
    })
  }

  const sampleMarkdown = `# मुख्य शीर्षक (Heading 1)

यह एक पैराग्राफ है। आप यहां **बोल्ड टेक्स्ट** और *इटैलिक टेक्स्ट* लिख सकते हैं।

## उप-शीर्षक (Heading 2)

आप लिस्ट भी बना सकते हैं:

- पहली आइटम
- दूसरी आइटम
- तीसरी आइटम

### छोटा शीर्षक (Heading 3)

> यह एक उद्धरण (quote) है। इसे इस तरह लिखें।

**महत्वपूर्ण बिंदु:** वैराग्य का अर्थ त्याग नहीं है।`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Markdown to HTML Converter
          </DialogTitle>
          <DialogDescription>
            Paste your Markdown content from Claude (or anywhere) and convert it to HTML for the blog editor.
            Supports Hindi (हिंदी) and English!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Markdown Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Markdown Content</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMarkdown(sampleMarkdown)}
              >
                Load Sample
              </Button>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your Markdown content here...

Example:
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- List item 1
- List item 2"
              rows={20}
              className="font-mono text-sm"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 Markdown Quick Guide:</p>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li><code className="bg-blue-100 px-1 rounded"># Text</code> = Heading 1</li>
                <li><code className="bg-blue-100 px-1 rounded">## Text</code> = Heading 2</li>
                <li><code className="bg-blue-100 px-1 rounded">### Text</code> = Heading 3</li>
                <li><code className="bg-blue-100 px-1 rounded">**Text**</code> = Bold</li>
                <li><code className="bg-blue-100 px-1 rounded">*Text*</code> = Italic</li>
                <li><code className="bg-blue-100 px-1 rounded">- Item</code> = List</li>
                <li><code className="bg-blue-100 px-1 rounded">&gt; Quote</code> = Blockquote</li>
              </ul>
            </div>
          </div>

          {/* Right: HTML Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>HTML Preview</Label>
              {preview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyHTML}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy HTML
                    </>
                  )}
                </Button>
              )}
            </div>

            {preview ? (
              <div className="border rounded-lg p-4 bg-white min-h-[400px] max-h-[500px] overflow-y-auto">
                <div
                  className="blog-preview"
                  dangerouslySetInnerHTML={{ __html: preview }}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans Devanagari", sans-serif',
                  }}
                />

                <style>{`
                  .blog-preview h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #dc2626;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    border-bottom: 3px solid #fb923c;
                    padding-bottom: 0.5rem;
                  }
                  .blog-preview h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #ea580c;
                    margin-top: 1.25rem;
                    margin-bottom: 0.75rem;
                    border-left: 4px solid #f97316;
                    padding-left: 0.75rem;
                    background: linear-gradient(90deg, #fed7aa 0%, transparent 100%);
                    padding-top: 0.25rem;
                    padding-bottom: 0.25rem;
                  }
                  .blog-preview h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #dc2626;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(90deg, #fef3c7 0%, transparent 100%);
                    padding: 0.25rem 0.5rem;
                    border-left: 3px solid #fbbf24;
                  }
                  .blog-preview h3::before {
                    content: '🔸 ';
                  }
                  .blog-preview p {
                    margin-bottom: 1rem;
                    line-height: 1.7;
                    color: #1f2937;
                  }
                  .blog-preview strong {
                    color: #dc2626;
                    font-weight: 700;
                  }
                  .blog-preview em {
                    color: #ea580c;
                    font-style: italic;
                  }
                  .blog-preview ul, .blog-preview ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .blog-preview li {
                    margin-bottom: 0.5rem;
                    color: #1f2937;
                  }
                  .blog-preview blockquote {
                    border-left: 4px solid #f97316;
                    background: #fed7aa;
                    padding: 0.75rem 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: #78350f;
                  }
                `}</style>
              </div>
            ) : (
              <div className="border border-dashed rounded-lg p-8 text-center bg-gray-50 min-h-[400px] flex flex-col items-center justify-center">
                <Sparkles className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Preview will appear here</p>
                <p className="text-sm text-gray-500">Paste Markdown on the left and click "Convert"</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleConvert}
            disabled={!markdown.trim()}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Convert to HTML
          </Button>
          <Button
            type="button"
            onClick={handleUseHTML}
            disabled={!preview}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Use in Editor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
