import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Quote, Edit, ExternalLink, User, BookOpen, Calendar, Tags } from 'lucide-react'

interface QuoteItem {
  id: string
  text: string
  text_hi: string | null
  author: string | null
  category: string | null
  source: string | null
  context: string | null
  tags: string[] | null
  created_at: string
  updated_at: string | null
}

interface QuoteViewModalProps {
  quote: QuoteItem | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (quote: QuoteItem) => void
}

export default function QuoteViewModal({ quote, isOpen, onClose, onEdit }: QuoteViewModalProps) {
  if (!quote) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">Quote Details</span>
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(quote)}
                  size="sm"
                  variant="outline"
                  className="bg-orange-50 hover:bg-orange-100 border-orange-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Main Quote Display */}
          <div className="text-center space-y-6">
            <Quote className="h-12 w-12 text-orange-500 mx-auto" />
            
            {/* English Quote */}
            <blockquote className="text-2xl md:text-3xl text-gray-800 italic leading-relaxed max-w-3xl mx-auto">
              "{quote.text}"
            </blockquote>
            
            {/* Hindi Quote */}
            {quote.text_hi && (
              <blockquote className="text-xl md:text-2xl text-orange-600 font-medium leading-relaxed max-w-3xl mx-auto">
                "{quote.text_hi}"
              </blockquote>
            )}
            
            {/* Attribution */}
            <div className="flex items-center justify-center space-x-2">
              <div className="h-px bg-orange-300 w-12"></div>
              <div className="text-lg text-gray-700 font-medium px-4">
                {quote.author || 'Unknown'}
                {quote.source && (
                  <span className="text-gray-500 text-base ml-2">• {quote.source}</span>
                )}
              </div>
              <div className="h-px bg-orange-300 w-12"></div>
            </div>

            {/* Category Badge */}
            {quote.category && (
              <Badge className="bg-orange-100 text-orange-800 px-4 py-2 text-sm">
                {quote.category}
              </Badge>
            )}
          </div>

          {/* Tags Section */}
          {quote.tags && quote.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-orange-200 pb-2 flex items-center">
                <Tags className="h-5 w-5 mr-2 text-orange-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {quote.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Context Section */}
          {quote.context && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-orange-200 pb-2 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
                Context & Background
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-100">
                <div className="text-gray-700 leading-relaxed">
                  {quote.context.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attribution Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-orange-200 pb-2">
              Attribution Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {quote.author && (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Author</h4>
                    <p className="text-gray-600">{quote.author}</p>
                  </div>
                </div>
              )}
              
              {quote.source && (
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Source</h4>
                    <p className="text-gray-600">{quote.source}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Badges */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-orange-200 pb-2">
              Content Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {quote.text_hi && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Hindi Translation
                </Badge>
              )}
              {quote.source && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Source Provided
                </Badge>
              )}
              {quote.context && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Has Context
                </Badge>
              )}
              {quote.tags && quote.tags.length > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {quote.tags.length} Tags
                </Badge>
              )}
              {(!quote.author || !quote.source) && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Incomplete Attribution
                </Badge>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Share This Wisdom</h4>
            <p className="text-gray-600 mb-4">
              Inspire others with this profound quote and spread divine wisdom.
            </p>
            <div className="flex space-x-3">
              <Button 
                size="sm" 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  const url = `${window.location.origin}/bhajans#quotes`
                  const shareText = `💫 "${quote.text}"\n\n${quote.text_hi ? `"${quote.text_hi}"\n\n` : ''}- ${quote.author || 'Ancient Wisdom'}\n\n${url}`
                  navigator.clipboard.writeText(shareText)
                }}
              >
                Copy Quote
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  const tweetText = `"${quote.text}" - ${quote.author || 'Ancient Wisdom'}`
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank')
                }}
              >
                Share on Twitter
              </Button>
            </div>
          </div>

          {/* Similar Quotes Suggestion */}
          {quote.tags && quote.tags.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Related Topics</h4>
              <p className="text-gray-600 text-sm mb-3">
                Users interested in this quote might also enjoy quotes about:
              </p>
              <div className="flex flex-wrap gap-2">
                {quote.tags.slice(0, 5).map((tag, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 hover:bg-orange-50"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Record Information</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <strong>Created:</strong> {formatDate(quote.created_at)}
              </div>
              {quote.updated_at && (
                <div>
                  <strong>Updated:</strong> {formatDate(quote.updated_at)}
                </div>
              )}
              <div>
                <strong>Quote ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{quote.id}</code>
              </div>
              <div>
                <strong>Frontend:</strong> 
                <a 
                  href={`http://localhost:8081/bhajans#quotes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  View Live
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}