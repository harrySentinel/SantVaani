import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, User, Book, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface SpiritualFact {
  id: string;
  text: string;
  text_hi?: string;
  category: string;
  icon: string;
  source?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface SpiritualFactViewModalProps {
  fact: SpiritualFact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (fact: SpiritualFact) => void;
}

const SpiritualFactViewModal: React.FC<SpiritualFactViewModalProps> = ({
  fact,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!fact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Spiritual Fact Details</span>
            <Button
              onClick={() => onEdit(fact)}
              size="sm"
              className="ml-4"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogTitle>
          <DialogDescription>
            View and manage spiritual fact information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge 
                variant={fact.is_active ? "default" : "secondary"}
                className={fact.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {fact.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {fact.is_active ? "Active" : "Inactive"}
              </Badge>
              
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <span className="mr-2">{fact.icon}</span>
                {fact.category}
              </Badge>
            </div>

            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Added: {format(new Date(fact.created_at), 'MMM dd, yyyy')}
              </div>
              {fact.updated_at && (
                <div className="flex items-center mt-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Updated: {format(new Date(fact.updated_at), 'MMM dd, yyyy')}
                </div>
              )}
            </div>
          </div>

          {/* Fact Preview */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 text-center">
              Preview on Website
            </h3>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-orange-200">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-2xl">{fact.icon}</span>
                  <span className="text-orange-600 font-semibold">{fact.category}</span>
                  <span className="text-2xl">{fact.icon}</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-800 text-lg leading-relaxed font-medium">
                  {fact.text}
                </p>
                
                {fact.text_hi && (
                  <p className="text-orange-600 text-base mt-3 leading-relaxed">
                    {fact.text_hi}
                  </p>
                )}
                
                {fact.source && (
                  <p className="text-gray-500 text-sm mt-3 italic">
                    — Source: {fact.source}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Text */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                English Text
              </Label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800 leading-relaxed">
                  {fact.text}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  Length: {fact.text.length} characters
                </div>
              </div>
            </div>

            {/* Hindi Text */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Hindi Text
              </Label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {fact.text_hi ? (
                  <>
                    <p className="text-gray-800 leading-relaxed">
                      {fact.text_hi}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      Length: {fact.text_hi.length} characters
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 italic">No Hindi translation added</p>
                )}
              </div>
            </div>

            {/* Category & Source */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Category & Source
              </Label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{fact.icon}</span>
                  <span className="text-gray-800 font-medium">{fact.category}</span>
                </div>
                {fact.source ? (
                  <div className="flex items-center space-x-2">
                    <Book className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{fact.source}</span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No source specified</p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Metadata
              </Label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${fact.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                    {fact.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-800 font-mono text-xs">{fact.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-800">{format(new Date(fact.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                {fact.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-800">{format(new Date(fact.updated_at), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Character Count Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-800 font-semibold mb-2">📝 Content Guidelines</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Keep facts concise and engaging (under 200 characters recommended)</p>
              <p>• Focus on surprising or lesser-known information</p>
              <p>• Verify accuracy before publishing</p>
              <p>• Add Hindi translations when possible for broader reach</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Label component (if not already available)
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

export default SpiritualFactViewModal;