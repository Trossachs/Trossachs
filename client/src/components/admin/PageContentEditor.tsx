import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageContent {
  title: string;
  content: string;
  metaDescription?: string;
  lastUpdated: Date;
}

interface PageContentEditorProps {
  pageType: 'about' | 'contact';
}

export function PageContentEditor({ pageType }: PageContentEditorProps) {
  const { toast } = useToast();
  const [content, setContent] = useState<PageContent | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Fetch page content
  const { isLoading, isError } = useQuery({
    queryKey: [`/api/pages/${pageType}`],
    queryFn: async () => {
      const res = await fetch(`/api/pages/${pageType}`);
      if (!res.ok) throw new Error(`Failed to fetch ${pageType} page content`);
      const data = await res.json();
      setContent(data.content);
      return data;
    }
  });

  // Update page content
  const updateMutation = useMutation({
    mutationFn: async (updatedContent: Partial<PageContent>) => {
      const res = await apiRequest('PATCH', `/api/admin/pages/${pageType}`, { content: updatedContent });
      return await res.json();
    },
    onSuccess: (data) => {
      setContent(data.content);
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageType}`] });
      toast({
        title: 'Success',
        description: `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} page has been updated`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update page: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const handleInputChange = (field: keyof PageContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  const handleSaveContent = () => {
    if (!content) return;
    updateMutation.mutate({
      title: content.title,
      content: content.content,
      metaDescription: content.metaDescription
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading page content...</span>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="p-8 text-destructive">
        <p>Error loading page content. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold capitalize">{pageType} Page</h2>
        <div className="space-x-2">
          <Button onClick={handleSaveContent} disabled={updateMutation.isPending}>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Page Title</label>
            <Input 
              value={content.title} 
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <Textarea 
              value={content.metaDescription || ''} 
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              className="mt-1 resize-none"
              rows={2}
              placeholder="Description for search engines (SEO)"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Updated</label>
            <p className="text-sm text-muted-foreground">
              {new Date(content.lastUpdated).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Page Content</CardTitle>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'edit' | 'preview')}>
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'edit' ? (
            <Textarea 
              value={content.content} 
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="HTML content for the page"
            />
          ) : (
            <div 
              className="prose max-w-none min-h-[400px] p-4 border rounded-md bg-white"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          )}
        </CardContent>
        <CardFooter className="bg-secondary/5 text-xs text-muted-foreground">
          <p>
            You can use HTML tags to format the content. For example, use &lt;h2&gt; for headings, 
            &lt;p&gt; for paragraphs, &lt;ul&gt; and &lt;li&gt; for lists.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}