import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp, 
  FaLinkedin, 
  FaPinterest 
} from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

interface ProductShareButtonProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  variant?: 'icon' | 'button';
  position?: 'top' | 'bottom';
}

const ProductShareButton: FC<ProductShareButtonProps> = ({ 
  url, 
  title, 
  description, 
  image,
  variant = 'icon',
  position = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = description ? encodeURIComponent(description) : '';
  const encodedImage = image ? encodeURIComponent(image) : '';
  
  // Create sharing URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDesc}%20${encodedUrl}`;
  
  const handleShare = (socialUrl: string) => {
    window.open(socialUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === 'icon' ? (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-neutral-light"
            aria-label="Share product"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            aria-label="Share product"
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="center" side={position === 'top' ? 'top' : 'bottom'}>
        <div className="flex flex-col space-y-1">
          <h4 className="font-medium text-sm mb-1 px-2">Share via</h4>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-blue-600 hover:text-white hover:bg-blue-600"
            onClick={() => handleShare(facebookUrl)}
          >
            <FaFacebook className="h-4 w-4" /> Facebook
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sky-500 hover:text-white hover:bg-sky-500"
            onClick={() => handleShare(twitterUrl)}
          >
            <FaTwitter className="h-4 w-4" /> Twitter
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-green-600 hover:text-white hover:bg-green-600"
            onClick={() => handleShare(whatsappUrl)}
          >
            <FaWhatsapp className="h-4 w-4" /> WhatsApp
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-blue-700 hover:text-white hover:bg-blue-700"
            onClick={() => handleShare(linkedinUrl)}
          >
            <FaLinkedin className="h-4 w-4" /> LinkedIn
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-600 hover:text-white hover:bg-red-600"
            onClick={() => handleShare(pinterestUrl)}
          >
            <FaPinterest className="h-4 w-4" /> Pinterest
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-gray-600 hover:text-white hover:bg-gray-600"
            onClick={() => window.location.href = emailUrl}
          >
            <IoMdMail className="h-4 w-4" /> Email
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductShareButton;