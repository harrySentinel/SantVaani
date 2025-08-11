import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase, TABLES } from '@/lib/supabase';

interface SpiritualFact {
  id?: string;
  text: string;
  text_hi?: string;
  category: string;
  icon: string;
  source?: string;
  is_active: boolean;
}

interface SpiritualFactFormProps {
  fact: SpiritualFact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const categories = [
  { value: 'Ramayana', icon: '🏹' },
  { value: 'Mahabharata', icon: '⚔️' },
  { value: 'Hindu Deities', icon: '🕉️' },
  { value: 'Hindu Scriptures', icon: '📿' },
  { value: 'Saints', icon: '🙏' },
  { value: 'Hindu History', icon: '🏛️' },
  { value: 'Hindu Festivals', icon: '🎪' },
  { value: 'Sanskrit Words', icon: '💡' },
  { value: 'Yoga & Meditation', icon: '🧘' },
  { value: 'Ayurveda', icon: '🌿' },
  { value: 'Temples', icon: '🛕' },
  { value: 'Mantras', icon: '🔉' }
];

const SpiritualFactForm: React.FC<SpiritualFactFormProps> = ({
  fact,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SpiritualFact>({
    text: '',
    text_hi: '',
    category: 'Hindu Deities',
    icon: '🕉️',
    source: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Update form when fact changes
  useEffect(() => {
    if (fact) {
      setFormData(fact);
    } else {
      setFormData({
        text: '',
        text_hi: '',
        category: 'Hindu Deities',
        icon: '🕉️',
        source: '',
        is_active: true,
      });
    }
  }, [fact, isOpen]);

  // Update icon when category changes
  const handleCategoryChange = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    setFormData(prev => ({
      ...prev,
      category,
      icon: categoryData?.icon || '🕉️'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.text.trim()) {
      toast({
        title: "Error",
        description: "Fact text is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.text.length > 200) {
      toast({
        title: "Error", 
        description: "Fact text should be under 200 characters for better display",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (fact?.id) {
        // Update existing fact
        const { error } = await supabase
          .from('spiritual_facts')
          .update({
            text: formData.text,
            text_hi: formData.text_hi || null,
            category: formData.category,
            icon: formData.icon,
            source: formData.source || null,
            is_active: formData.is_active,
          })
          .eq('id', fact.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Spiritual fact updated successfully!"
        });
      } else {
        // Create new fact
        const { error } = await supabase
          .from('spiritual_facts')
          .insert([{
            text: formData.text,
            text_hi: formData.text_hi || null,
            category: formData.category,
            icon: formData.icon,
            source: formData.source || null,
            is_active: formData.is_active,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Spiritual fact added successfully!"
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving fact:', error);
      toast({
        title: "Error",
        description: "Failed to save spiritual fact. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {fact ? 'Edit Spiritual Fact' : 'Add New Spiritual Fact'}
          </DialogTitle>
          <DialogDescription>
            Add interesting spiritual facts that will be displayed on the homepage. 
            Keep facts concise (under 200 characters) for better readability.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Fact Text */}
            <div>
              <Label htmlFor="text">
                Fact Text (English) *
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.text.length}/200 characters)
                </span>
              </Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter an interesting spiritual fact..."
                className="min-h-[80px]"
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Keep it concise and fascinating. Example: "Hanuman's heart contains an image of Rama and Sita inside it."
              </p>
            </div>

            {/* Hindi Text */}
            <div>
              <Label htmlFor="text_hi">
                Fact Text (Hindi) - Optional
              </Label>
              <Textarea
                id="text_hi"
                value={formData.text_hi || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, text_hi: e.target.value }))}
                placeholder="हिंदी में रोचक तथ्य दर्ज करें..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source */}
              <div>
                <Label htmlFor="source">Source - Optional</Label>
                <Input
                  id="source"
                  type="text"
                  value={formData.source || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., Ramayana, Bhagavad Gita"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Preview:</h4>
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-600 font-semibold text-sm">
                    {formData.icon} {formData.category}
                  </span>
                  {formData.source && (
                    <span className="text-xs text-gray-500">
                      Source: {formData.source}
                    </span>
                  )}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {formData.text || 'Your fact will appear here...'}
                </p>
                {formData.text_hi && (
                  <p className="text-orange-600 text-sm mt-2 leading-relaxed">
                    {formData.text_hi}
                  </p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="is_active" className="text-sm">
                Active (will be displayed on website)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (fact ? 'Update Fact' : 'Add Fact')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpiritualFactForm;