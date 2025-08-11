import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Music, Edit, ExternalLink, Play, User, Calendar } from 'lucide-react'

interface Bhajan {
  id: string
  title: string
  title_hi: string | null
  category: string | null
  lyrics: string | null
  lyrics_hi: string | null
  meaning: string | null
  author: string | null
  youtube_url: string | null
  created_at: string
  updated_at: string | null
}

interface BhajanViewModalProps {
  bhajan: Bhajan | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (bhajan: Bhajan) => void
}

export default function BhajanViewModal({ bhajan, isOpen, onClose, onEdit }: BhajanViewModalProps) {
  if (!bhajan) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const youtubeVideoId = getYouTubeVideoId(bhajan.youtube_url || '')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">Bhajan Details</span>
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(bhajan)}
                  size="sm"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 border-green-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">{bhajan.title}</h2>
                {bhajan.title_hi && (
                  <p className="text-xl text-green-600 font-medium">{bhajan.title_hi}</p>
                )}
              </div>
              <Music className="h-12 w-12 text-green-500" />
            </div>

            <div className="flex items-center space-x-4">
              {bhajan.category && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {bhajan.category}
                </Badge>
              )}
              {bhajan.author && (
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">{bhajan.author}</span>
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {bhajan.lyrics_hi && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Hindi Lyrics
                </Badge>
              )}
              {bhajan.youtube_url && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  YouTube Link
                </Badge>
              )}
              {bhajan.meaning && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Has Meaning
                </Badge>
              )}
              {(!bhajan.lyrics || !bhajan.meaning) && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Incomplete
                </Badge>
              )}
            </div>
          </div>

          {/* YouTube Video Section */}
          {bhajan.youtube_url && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-green-200 pb-2">
                Audio/Video
              </h3>
              <div className="space-y-3">
                {youtubeVideoId ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title={bhajan.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Play className="h-5 w-5 text-red-500" />
                    <a 
                      href={bhajan.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      Open YouTube Link
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lyrics Section */}
          {(bhajan.lyrics || bhajan.lyrics_hi) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-green-200 pb-2">Lyrics</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {bhajan.lyrics && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">English</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {bhajan.lyrics}
                      </pre>
                    </div>
                  </div>
                )}
                {bhajan.lyrics_hi && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Hindi</h4>
                    <div className="bg-green-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {bhajan.lyrics_hi}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meaning Section */}
          {bhajan.meaning && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-green-200 pb-2">
                Meaning & Significance
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-100">
                <div className="text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
                  {bhajan.meaning.split('\\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-green-200 pb-2">
              Additional Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {bhajan.category && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Category</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{bhajan.category}</p>
                </div>
              )}
              {bhajan.author && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Author/Composer</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{bhajan.author}</p>
                </div>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Share This Bhajan</h4>
            <p className="text-gray-600 mb-4">
              Spread the divine vibrations of "{bhajan.title}" with others and help them connect with the sacred.
            </p>
            <div className="flex space-x-3">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  const url = `${window.location.origin}/bhajans#${bhajan.id}`
                  navigator.clipboard.writeText(`🎵 ${bhajan.title}\n${bhajan.title_hi ? bhajan.title_hi + '\n' : ''}${url}`)
                }}
              >
                Copy Link
              </Button>
              {bhajan.youtube_url && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(bhajan.youtube_url!, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Listen on YouTube
                </Button>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Record Information</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <strong>Created:</strong> {formatDate(bhajan.created_at)}
              </div>
              {bhajan.updated_at && (
                <div>
                  <strong>Updated:</strong> {formatDate(bhajan.updated_at)}
                </div>
              )}
              <div>
                <strong>Bhajan ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{bhajan.id}</code>
              </div>
              <div>
                <strong>Frontend:</strong> 
                <a 
                  href={`http://localhost:8081/bhajans#${bhajan.id}`}
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