import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Crown, Shield, Edit, ExternalLink, Calendar, MapPin } from 'lucide-react'

interface DivineForm {
  id: string
  name: string
  name_hi: string | null
  domain: string | null
  domain_hi: string | null
  image_url: string | null
  description: string | null
  description_hi: string | null
  attributes: string[] | null
  mantra: string | null
  significance: string | null
  created_at: string
  updated_at: string | null
}

interface DivineFormViewModalProps {
  divineForm: DivineForm | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (divineForm: DivineForm) => void
}

export default function DivineFormViewModal({ divineForm, isOpen, onClose, onEdit }: DivineFormViewModalProps) {
  if (!divineForm) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getIconForDomain = (domain: string) => {
    if (domain?.includes('Love') || domain?.includes('Grace')) return Sparkles;
    if (domain?.includes('Justice') || domain?.includes('Wisdom')) return Crown;
    if (domain?.includes('Strength') || domain?.includes('Protection')) return Shield;
    return Sparkles;
  }

  const DomainIcon = getIconForDomain(divineForm.domain || '')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">Divine Form Details</span>
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(divineForm)}
                  size="sm"
                  variant="outline"
                  className="bg-purple-50 hover:bg-purple-100 border-purple-200"
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
              {divineForm.image_url ? (
                <img
                  src={divineForm.image_url}
                  alt={divineForm.name}
                  className="w-48 h-48 object-cover rounded-lg border shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-48 h-48 bg-purple-100 rounded-lg border flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-purple-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{divineForm.name}</h2>
                {divineForm.name_hi && (
                  <p className="text-xl text-purple-600 font-medium mt-1">{divineForm.name_hi}</p>
                )}
              </div>

              <div className="space-y-3">
                {divineForm.domain && (
                  <div className="flex items-center">
                    <DomainIcon className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <span className="text-gray-900 font-medium">{divineForm.domain}</span>
                      {divineForm.domain_hi && (
                        <span className="text-gray-600 text-sm block">{divineForm.domain_hi}</span>
                      )}
                    </div>
                  </div>
                )}

                {divineForm.mantra && (
                  <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🕉️</span>
                      <div>
                        <p className="text-sm text-purple-600 font-medium mb-1">Sacred Mantra</p>
                        <p className="text-gray-800 font-medium">{divineForm.mantra}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {divineForm.image_url && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Has Image
                  </Badge>
                )}
                {divineForm.description_hi && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Hindi Content
                  </Badge>
                )}
                {divineForm.mantra && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Has Mantra
                  </Badge>
                )}
                {divineForm.attributes && divineForm.attributes.length > 0 && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {divineForm.attributes.length} Attributes
                  </Badge>
                )}
                {(!divineForm.description || !divineForm.significance) && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Incomplete
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {(divineForm.description || divineForm.description_hi) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">Description</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {divineForm.description && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">English</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {divineForm.description}
                    </p>
                  </div>
                )}
                {divineForm.description_hi && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Hindi</h4>
                    <p className="text-gray-600 leading-relaxed bg-purple-50 p-4 rounded-lg">
                      {divineForm.description_hi}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attributes Section */}
          {divineForm.attributes && divineForm.attributes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">Attributes</h3>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Key Attributes</h4>
                <div className="flex flex-wrap gap-2">
                  {divineForm.attributes.map((attribute, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {attribute}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Significance Section */}
          {divineForm.significance && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">Significance</h3>
              <div>
                <div className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  {divineForm.significance.split('\\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}



          {/* Metadata Section */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Record Information</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <strong>Created:</strong> {formatDate(divineForm.created_at)}
              </div>
              {divineForm.updated_at && (
                <div>
                  <strong>Updated:</strong> {formatDate(divineForm.updated_at)}
                </div>
              )}
              <div>
                <strong>Form ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{divineForm.id}</code>
              </div>
              <div>
                <strong>Frontend:</strong> 
                <a 
                  href={`http://localhost:8081/divine#${divineForm.id}`}
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