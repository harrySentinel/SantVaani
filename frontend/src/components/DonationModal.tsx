
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Heart, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: number;
  name: string;
  nameHi: string;
  type: 'Vridh Ashram' | 'Orphanage';
  typeHi: string;
  location: string;
  locationHi: string;
  establishedYear: number;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  description: string;
  descriptionHi: string;
  needs: string[];
  capacity: number;
  qrCodeUrl?: string;
}

interface DonationModalProps {
  organization: Organization;
  onClose: () => void;
}

// Generate UPI ID based on organization name
const generateUpiId = (orgName: string): string => {
  const cleanName = orgName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanName}@paytm`;
};

const DonationModal: React.FC<DonationModalProps> = ({ organization, onClose }) => {
  const { toast } = useToast();
  const upiId = generateUpiId(organization.name);

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      toast({
        title: "✅ Copied!",
        description: "UPI ID copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
      toast({
        title: "Copy Failed",
        description: "Please copy the UPI ID manually",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Support Donation for {organization.name}</DialogTitle>
          <DialogDescription>
            Make a donation to support {organization.name} through UPI payment
          </DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <h2 className="text-lg sm:text-xl font-bold">Support Donation</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-base sm:text-lg">{organization.name}</h3>
            <p className="text-orange-100 text-xs sm:text-sm">{organization.nameHi}</p>
            <p className="text-orange-100 text-xs sm:text-sm">{organization.location}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* QR Code Section */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-8 border border-orange-200">
              <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-orange-200 overflow-hidden">
                {organization.qrCodeUrl ? (
                  <img 
                    src={organization.qrCodeUrl} 
                    alt={`QR Code for ${organization.name}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-400 text-xs sm:text-sm">QR Code</span>
                    </div>
                    <p className="text-xs text-gray-500">QR Code for</p>
                    <p className="text-xs text-gray-700 font-medium break-words">{organization.name}</p>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-4">
                Scan this QR code with any UPI app to donate
              </p>
            </div>
          </div>

          {/* UPI ID Section */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">UPI ID</p>
                <p className="text-sm sm:text-lg font-mono text-gray-800 break-all">{upiId}</p>
              </div>
              <Button
                onClick={handleCopyUpiId}
                variant="outline"
                size="sm"
                className="ml-2 border-orange-300 text-orange-600 hover:bg-orange-50 shrink-0"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              <strong>Type:</strong> {organization.type}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              <strong>Capacity:</strong> {organization.capacity} residents
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              <strong>Established:</strong> {organization.establishedYear}
            </p>
          </div>

          {/* Thank You Message */}
          <div className="text-center bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 border border-orange-200">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-700 font-medium">
              Your donation will make a real difference in the lives of those who need it most.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Thank you for your compassion and generosity 🙏
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;