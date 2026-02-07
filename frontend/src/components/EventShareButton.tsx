import React, { useState } from 'react';
import { Share2, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';
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
  generateEventWhatsAppMessage,
  type EventShareData
} from '@/utils/eventShareUtils';

interface EventShareButtonProps {
  event: EventShareData;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export default function EventShareButton({
  event,
  variant = 'ghost',
  size = 'sm',
  className = '',
  showLabel = false
}: EventShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const baseUrl = window.location.origin;
  const eventUrl = `${baseUrl}/events#${event.id}`;

  const shareContent: ShareContent = {
    title: `${event.title} - ${event.type.replace('-', ' ')}`,
    description: `${event.description.substring(0, 150)}...`,
    url: eventUrl,
    hashtags: ['SantvaaniEvent', event.type.replace('-', ''), 'Santvaani']
  };

  const handleWhatsAppShare = () => {
    try {
      const whatsappMessage = generateEventWhatsAppMessage(event);
      shareOnWhatsApp(whatsappMessage);
      toast({
        title: "WhatsApp Share",
        description: "Opening WhatsApp to share event",
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
      const whatsappMessage = generateEventWhatsAppMessage(event);
      const fullMessage = decodeURIComponent(whatsappMessage);

      const success = await copyToClipboard(fullMessage);
      if (success) {
        toast({
          title: "Message Copied!",
          description: "Event information copied to clipboard - ready to share!",
        });
      } else {
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
        description: "Event shared successfully",
      });
      setIsOpen(false);
    } else {
      handleWhatsAppShare();
    }
  };

  const handleTwitterShare = () => {
    shareOnTwitter(shareContent);
    toast({
      title: "Twitter Share",
      description: "Opening Twitter to share event",
    });
    setIsOpen(false);
  };

  const handleFacebookShare = () => {
    shareOnFacebook(eventUrl);
    toast({
      title: "Facebook Share",
      description: "Opening Facebook to share event",
    });
    setIsOpen(false);
  };

  const showManualCopyModal = (textToCopy?: string) => {
    const copyText = textToCopy || decodeURIComponent(generateEventWhatsAppMessage(event));

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
        <h3 style="margin-bottom: 15px; color: #333;">Copy Event Information</h3>
        <textarea
          rows="10"
          readonly
          style="
            width: 100%;
            padding: 10px;
            border: 2px solid #f97316;
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
            background: #f97316;
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

  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={className || 'inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}
          aria-label="Share event"
        >
          <Share2 className="h-4 w-4" />
          {showLabel && <span>Share</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-3 text-green-600" />
          <span>WhatsApp</span>
        </DropdownMenuItem>

        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
            <Share2 className="h-4 w-4 mr-3 text-blue-600" />
            <span>Share...</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyMessage} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-3 text-gray-600" />
          <span>Copy Message</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

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
