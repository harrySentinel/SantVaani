import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Star, Image as ImageIcon, Edit, X } from 'lucide-react'

interface Saint {
  id: string
  name: string
  name_hi: string | null
  period: string | null
  region: string | null
  image_url: string | null
  description: string | null
  description_hi: string | null
  specialty: string | null
  specialty_hi: string | null
  biography: string | null
  biography_hi: string | null
  created_at: string
  updated_at: string | null
}

interface SaintViewModalProps {
  saint: Saint | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (saint: Saint) => void
}

export default function SaintViewModal({ saint, isOpen, onClose, onEdit }: SaintViewModalProps) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">Saint Details</span>
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(saint)}
                  size="sm"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="flex-shrink-0">
              {saint.image_url ? (
                <img
                  src={saint.image_url}
                  alt={saint.name}
                  className="w-48 h-48 object-cover rounded-lg border shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{saint.name}</h2>
                {saint.name_hi && (
                  <p className="text-xl text-orange-600 font-medium mt-1">{saint.name_hi}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {saint.specialty && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-orange-500 mr-2" />
                    <div>
                      <span className="text-gray-900">{saint.specialty}</span>
                      {saint.specialty_hi && (
                        <span className="text-gray-600 text-sm block">{saint.specialty_hi}</span>
                      )}
                    </div>
                  </div>
                )}

                {saint.period && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-gray-700">{saint.period}</span>
                  </div>
                )}

                {saint.region && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-gray-700">{saint.region}</span>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {saint.image_url && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Has Image
                  </Badge>
                )}
                {saint.biography_hi && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Hindi Content
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
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {saint.description && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">English</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {saint.description}
                    </p>
                  </div>
                )}
                {saint.description_hi && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Hindi</h4>
                    <p className="text-gray-600 leading-relaxed bg-orange-50 p-4 rounded-lg">
                      {saint.description_hi}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Biography Section */}
          {(saint.biography || saint.biography_hi) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Biography</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {saint.biography && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">English</h4>
                    <div className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
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
                    <h4 className="font-medium text-gray-700 mb-2">Hindi</h4>
                    <div className="text-gray-600 leading-relaxed bg-orange-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      {saint.biography_hi.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Record Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Created:</strong> {formatDate(saint.created_at)}
              </div>
              {saint.updated_at && (
                <div>
                  <strong>Updated:</strong> {formatDate(saint.updated_at)}
                </div>
              )}
              <div>
                <strong>Saint ID:</strong> <code className="bg-gray-100 px-1 rounded">{saint.id}</code>
              </div>
              <div>
                <strong>Frontend URL:</strong> 
                <a 
                  href={`http://localhost:8081/saints#${saint.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  View on Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}