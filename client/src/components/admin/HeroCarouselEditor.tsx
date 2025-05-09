import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeroSlide {
  id: number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroCarouselEditor() {
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isNewSlideOpen, setIsNewSlideOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<Partial<HeroSlide>>({
    imageUrl: '',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: ''
  });

  // Fetch carousel slides
  const { isLoading, isError } = useQuery({
    queryKey: ['/api/hero-carousel'],
    queryFn: async () => {
      const res = await fetch('/api/hero-carousel');
      if (!res.ok) throw new Error('Failed to fetch carousel slides');
      const data = await res.json();
      setSlides(data.slides || []);
      return data;
    }
  });

  // Update carousel slides
  const updateMutation = useMutation({
    mutationFn: async (updatedSlides: HeroSlide[]) => {
      const res = await apiRequest('PATCH', '/api/admin/hero-carousel', { slides: updatedSlides });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-carousel'] });
      toast({
        title: 'Success',
        description: 'Hero carousel has been updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update carousel: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const handleInputChange = (id: number, field: keyof HeroSlide, value: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const handleNewSlideInputChange = (field: keyof HeroSlide, value: string) => {
    setNewSlide(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSlides = () => {
    updateMutation.mutate(slides);
  };

  const handleDeleteSlide = (id: number) => {
    setSlides(prev => prev.filter(slide => slide.id !== id));
  };

  const handleAddSlide = () => {
    // Generate a new ID (just for client-side display before saving)
    const maxId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) : 0;
    const newSlideWithId = { 
      ...newSlide, 
      id: maxId + 1
    } as HeroSlide;
    
    setSlides(prev => [...prev, newSlideWithId]);
    setNewSlide({
      imageUrl: '',
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: ''
    });
    setIsNewSlideOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading carousel settings...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-destructive">
        <p>Error loading carousel settings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero Carousel</h2>
        <Button onClick={handleSaveSlides} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map(slide => (
          <Card key={slide.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex justify-between items-center">
                Slide {slide.id}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {slide.imageUrl && (
                <div className="rounded-md overflow-hidden h-40 mb-4">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input 
                    value={slide.imageUrl} 
                    onChange={e => handleInputChange(slide.id, 'imageUrl', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={slide.title} 
                    onChange={e => handleInputChange(slide.id, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subtitle</label>
                  <Textarea 
                    value={slide.subtitle || ''} 
                    onChange={e => handleInputChange(slide.id, 'subtitle', e.target.value)}
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Button Text</label>
                    <Input 
                      value={slide.ctaText || ''} 
                      onChange={e => handleInputChange(slide.id, 'ctaText', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Button Link</label>
                    <Input 
                      value={slide.ctaLink || ''} 
                      onChange={e => handleInputChange(slide.id, 'ctaLink', e.target.value)}
                      className="mt-1"
                      placeholder="/category/..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add new slide card */}
        {isNewSlideOpen ? (
          <Card className="overflow-hidden border-dashed">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">New Slide</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input 
                    value={newSlide.imageUrl} 
                    onChange={e => handleNewSlideInputChange('imageUrl', e.target.value)}
                    className="mt-1"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={newSlide.title} 
                    onChange={e => handleNewSlideInputChange('title', e.target.value)}
                    className="mt-1"
                    placeholder="Slide Title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subtitle</label>
                  <Textarea 
                    value={newSlide.subtitle || ''} 
                    onChange={e => handleNewSlideInputChange('subtitle', e.target.value)}
                    className="mt-1 resize-none"
                    rows={2}
                    placeholder="Optional subtitle text"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Button Text</label>
                    <Input 
                      value={newSlide.ctaText || ''} 
                      onChange={e => handleNewSlideInputChange('ctaText', e.target.value)}
                      className="mt-1"
                      placeholder="Shop Now"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Button Link</label>
                    <Input 
                      value={newSlide.ctaLink || ''} 
                      onChange={e => handleNewSlideInputChange('ctaLink', e.target.value)}
                      className="mt-1"
                      placeholder="/category/..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-end space-x-2 bg-secondary/5">
              <Button variant="outline" onClick={() => setIsNewSlideOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSlide} disabled={!newSlide.imageUrl || !newSlide.title}>
                Add Slide
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card 
            className="border-dashed border-2 flex items-center justify-center h-[450px] cursor-pointer hover:bg-secondary/5 transition-colors"
            onClick={() => setIsNewSlideOpen(true)}
          >
            <div className="text-center p-6">
              <Plus className="mx-auto h-12 w-12 text-primary/50" />
              <p className="mt-2 text-muted-foreground">Add New Slide</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}