import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, Users, MapPin, Building, Edit, ExternalLink } from 'lucide-react'

interface LivingSaint {
  id: string
  name: string
  name_hi: string | null
  organization: string | null
  specialty: string | null
  specialty_hi: string | null
  image: string | null
  description: string | null
  description_hi: string | null
  website: string | null
  followers: string | null
  teachings: string[] | null
  birth_place: string | null
  birth_place_hi: string | null
  current_location: string | null
  current_location_hi: string | null
  biography: string | null
  biography_hi: string | null
  spiritual_journey: string | null
  spiritual_journey_hi: string | null
  key_teachings: string[] | null
  key_teachings_hi: string[] | null
  quotes: string[] | null
  quotes_hi: string[] | null
  ashram: string | null
  ashram_hi: string | null
  lineage: string | null
  lineage_hi: string | null
  created_at: string
  updated_at: string | null
}

interface LivingSaintViewModalProps {
  saint: LivingSaint | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (saint: LivingSaint) => void
}

export default function LivingSaintViewModal({ saint, isOpen, onClose, onEdit }: LivingSaintViewModalProps) {
  if (!saint) return null

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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">Living Saint Details</span>
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(saint)}
                  size="sm"
                  variant="outline"
                  className="bg-red-50 hover:bg-red-100 border-red-200"
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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image */}
            <div className="flex-shrink-0">
              {saint.image ? (
                <img
                  src={saint.image}
                  alt={saint.name}
                  className="w-48 h-48 object-cover rounded-lg border shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-48 h-48 bg-red-100 rounded-lg border flex items-center justify-center">
                  <Users className="h-16 w-16 text-red-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{saint.name}</h2>
                {saint.name_hi && (
                  <p className="text-xl text-red-600 font-medium mt-1">{saint.name_hi}</p>
                )}
              </div>

              <div className="space-y-3">
                {saint.organization && (
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-900 font-medium">{saint.organization}</span>
                    {saint.followers && (
                      <span className="text-gray-600 text-sm ml-2">({saint.followers} followers)</span>
                    )}
                  </div>
                )}

                {saint.specialty && (
                  <div className="flex items-start">
                    <span className="text-gray-700 mr-2">🎯</span>
                    <div>
                      <span className="text-gray-900">{saint.specialty}</span>
                      {saint.specialty_hi && (
                        <span className="text-gray-600 text-sm block">{saint.specialty_hi}</span>
                      )}
                    </div>
                  </div>
                )}

                {(saint.current_location || saint.ashram) && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      {saint.current_location && (
                        <div className="text-gray-700">
                          <span>{saint.current_location}</span>
                          {saint.current_location_hi && (
                            <span className="text-gray-600 text-sm block">{saint.current_location_hi}</span>
                          )}
                        </div>
                      )}
                      {saint.ashram && (
                        <div className="text-gray-600 text-sm mt-1">
                          🏛️ {saint.ashram}
                          {saint.ashram_hi && ` (${saint.ashram_hi})`}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {saint.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-green-500 mr-3" />
                    <a 
                      href={saint.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {saint.image && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Has Image
                  </Badge>
                )}
                {saint.description_hi && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Hindi Content
                  </Badge>
                )}
                {saint.website && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Has Website
                  </Badge>
                )}
                {saint.teachings && saint.teachings.length > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {saint.teachings.length} Teachings
                  </Badge>
                )}
                {(!saint.description || !saint.biography) && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Incomplete
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {(saint.description || saint.description_hi) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-red-200 pb-2">Description</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {saint.description && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">English</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {saint.description}
                    </p>
                  </div>
                )}
                {saint.description_hi && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Hindi</h4>
                    <p className="text-gray-600 leading-relaxed bg-red-50 p-4 rounded-lg">
                      {saint.description_hi}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Teachings Section */}
          {(saint.teachings || saint.key_teachings) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-red-200 pb-2">Teachings & Philosophy</h3>
              
              {saint.teachings && saint.teachings.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Core Teachings</h4>
                  <div className="flex flex-wrap gap-2">
                    {saint.teachings.map((teaching, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                        {teaching}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(saint.key_teachings || saint.key_teachings_hi) && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {saint.key_teachings && saint.key_teachings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Key Teachings (English)</h4>
                      <div className="space-y-2">
                        {saint.key_teachings.map((teaching, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-600">{teaching}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {saint.key_teachings_hi && saint.key_teachings_hi.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Key Teachings (Hindi)</h4>
                      <div className="space-y-2">
                        {saint.key_teachings_hi.map((teaching, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-600">{teaching}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {saint.lineage && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Spiritual Lineage</h4>
                  <p className="text-gray-600 bg-purple-50 p-3 rounded-lg">{saint.lineage}</p>
                </div>
              )}
            </div>
          )}

          {/* Biography Section */}
          {(saint.biography || saint.biography_hi || saint.spiritual_journey) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-red-200 pb-2">Biography & Journey</h3>
              
              {(saint.biography || saint.biography_hi) && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {saint.biography && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Biography (English)</h4>
                      <div className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                        {saint.biography.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {saint.biography_hi && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Biography (Hindi)</h4>
                      <div className="text-gray-600 leading-relaxed bg-red-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                        {saint.biography_hi.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(saint.spiritual_journey || saint.spiritual_journey_hi) && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {saint.spiritual_journey && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Spiritual Journey (English)</h4>
                      <div className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        {saint.spiritual_journey.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {saint.spiritual_journey_hi && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Spiritual Journey (Hindi)</h4>
                      <div className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        {saint.spiritual_journey_hi.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Location Information */}
          {(saint.birth_place || saint.current_location) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-red-200 pb-2">Location Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {saint.birth_place && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Birth Place</h4>
                    <p className="text-gray-600">
                      {saint.birth_place}
                      {saint.birth_place_hi && (
                        <span className="block text-sm text-gray-500 mt-1">{saint.birth_place_hi}</span>
                      )}
                    </p>
                  </div>
                )}
                {saint.current_location && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Current Location</h4>
                    <p className="text-gray-600">
                      {saint.current_location}
                      {saint.current_location_hi && (
                        <span className="block text-sm text-gray-500 mt-1">{saint.current_location_hi}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quotes Section */}
          {(saint.quotes || saint.quotes_hi) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-red-200 pb-2">Quotes</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {saint.quotes && saint.quotes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">English Quotes</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {saint.quotes.map((quote, index) => (
                        <blockquote key={index} className="bg-gray-50 p-3 rounded-lg italic text-gray-600 border-l-4 border-gray-300">
                          "{quote}"
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}
                {saint.quotes_hi && saint.quotes_hi.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Hindi Quotes</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {saint.quotes_hi.map((quote, index) => (
                        <blockquote key={index} className="bg-red-50 p-3 rounded-lg italic text-gray-600 border-l-4 border-red-300">
                          "{quote}"
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Record Information</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <strong>Created:</strong> {formatDate(saint.created_at)}
              </div>
              {saint.updated_at && (
                <div>
                  <strong>Updated:</strong> {formatDate(saint.updated_at)}
                </div>
              )}
              <div>
                <strong>Saint ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{saint.id}</code>
              </div>
              <div>
                <strong>Frontend:</strong> 
                <a 
                  href={`http://localhost:8081/living-saints#${saint.id}`}
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