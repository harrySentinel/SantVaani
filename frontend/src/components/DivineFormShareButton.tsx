import React, { useState } from 'react';
import { Share2, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  shareOnWhatsApp,
  copyToClipboard,
  nativeShare,
  shareOnTwitter,
  shareOnFacebook,
  type ShareContent
} from '@/utils/shareUtils';
import {
  generateDivineFormWhatsAppMessage,
  type DivineFormShareData
} from '@/utils/divineFormShareUtils';

interface DivineFormShareButtonProps {
  form: DivineFormShareData;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function DivineFormShareButton({ 
  form, 
  variant = 'ghost', 
  size = 'sm',
  className = ''
}: DivineFormShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const baseUrl = window.location.origin;
  const formUrl = `${baseUrl}/divine#${form.id}`;

  // Generate share content
  const shareContent: ShareContent = {
    title: `${form.name} ${form.name_hi ? `(${form.name_hi})` : ''} - Divine Form`,
    description: `${form.domain_hi || form.domain} | ${form.mantra} | ${form.attributes.join(', ')}`,
    url: formUrl,
    hashtags: ['DivineForm', form.name.replace(/\s+/g, ''), 'Santvaani', 'Spirituality']
  };

  const handleWhatsAppShare = () => {
    try {
      const whatsappMessage = generateDivineFormWhatsAppMessage(form);
      shareOnWhatsApp(whatsappMessage);
      toast({
        title: "WhatsApp Share",
        description: "Opening WhatsApp to share divine form information",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not open WhatsApp. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyMessage = async () => {
    try {
      // Generate the full formatted message for copying
      const whatsappMessage = generateDivineFormWhatsAppMessage(form);
      const fullMessage = decodeURIComponent(whatsappMessage);
      
      const success = await copyToClipboard(fullMessage);
      if (success) {
        toast({
          title: "Message Copied!",
          description: "Divine form information copied to clipboard - ready to share!",
        });
      } else {
        // Show manual copy modal for mobile
        showManualCopyModal(fullMessage);
      }
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy message. Please try manual selection.",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    const shared = await nativeShare(shareContent);
    if (shared) {
      toast({
        title: "Shared Successfully",
        description: "Divine form information shared",
      });
      setIsOpen(false);
    } else {
      // Fallback to WhatsApp if native share not available
      handleWhatsAppShare();
    }
  };

  const handleTwitterShare = () => {
    shareOnTwitter(shareContent);
    toast({
      title: "Twitter Share",
      description: "Opening Twitter to share divine form information",
    });
    setIsOpen(false);
  };

  const handleFacebookShare = () => {
    shareOnFacebook(formUrl);
    toast({
      title: "Facebook Share", 
      description: "Opening Facebook to share divine form profile",
    });
    setIsOpen(false);
  };


  const showManualCopyModal = (textToCopy?: string) => {
    const copyText = textToCopy || decodeURIComponent(generateDivineFormWhatsAppMessage(form));
    
    // Create temporary modal for manual copy on mobile
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        padding: 20px;
        border-radius: 12px;
        max-width: 400px;
        width: 100%;
        text-align: center;
      ">
        <h3 style="margin-bottom: 15px; color: #333;">Copy Divine Form Information</h3>
        <textarea 
          rows="8"
          readonly
          style="
            width: 100%;
            padding: 10px;
            border: 2px solid #9333ea;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 12px;
            resize: none;
            font-family: monospace;
          "
          id="copyInput"
        >${copyText}</textarea>
        <p style="margin-bottom: 15px; font-size: 12px; color: #666;">
          Tap and hold to select all, then copy
        </p>
        <div>
          <button onclick="
            document.getElementById('copyInput').select();
            document.execCommand('copy');
            document.body.removeChild(this.parentElement.parentElement.parentElement);
            alert('Copied to clipboard!');
          " style="
            background: #9333ea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            margin-right: 10px;
            cursor: pointer;
          ">Copy</button>
          <button onclick="
            document.body.removeChild(this.parentElement.parentElement.parentElement);
          " style="
            background: #666;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
          ">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  };

  // Check if device supports native sharing
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`${className}`}
          aria-label="Share divine form information"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* WhatsApp - Primary option for Indian audience */}
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-3 text-green-600" />
          <span>WhatsApp</span>
        </DropdownMenuItem>

        {/* Native Share - Mobile devices */}
        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
            <Share2 className="h-4 w-4 mr-3 text-blue-600" />
            <span>Share...</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Copy Message */}
        <DropdownMenuItem onClick={handleCopyMessage} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-3 text-gray-600" />
          <span>Copy Message</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Social Media Options */}
        <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-3 text-blue-400" />
          <span>Twitter</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-3 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}