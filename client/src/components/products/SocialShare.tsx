import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

const SocialShare: FC<SocialShareProps> = ({ url, title, description, image }) => {
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
  };
  
  return (
    <div>
      <span className="text-sm font-medium mr-3">Share:</span>
      <div className="flex space-x-2 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 text-blue-600 hover:text-white hover:bg-blue-600"
                onClick={() => handleShare(facebookUrl)}
                aria-label="Share on Facebook"
              >
                <FaFacebook className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 text-sky-500 hover:text-white hover:bg-sky-500"
                onClick={() => handleShare(twitterUrl)}
                aria-label="Share on Twitter"
              >
                <FaTwitter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 text-green-600 hover:text-white hover:bg-green-600"
                onClick={() => handleShare(whatsappUrl)}
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on WhatsApp</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 text-blue-700 hover:text-white hover:bg-blue-700"
                onClick={() => handleShare(linkedinUrl)}
                aria-label="Share on LinkedIn"
              >
                <FaLinkedin className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on LinkedIn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 text-red-600 hover:text-white hover:bg-red-600"
                onClick={() => handleShare(pinterestUrl)}
                aria-label="Share on Pinterest"
              >
                <FaPinterest className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Pinterest</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 text-gray-600 hover:text-white hover:bg-gray-600"
                onClick={() => window.location.href = emailUrl}
                aria-label="Share via Email"
              >
                <IoMdMail className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share via Email</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SocialShare;