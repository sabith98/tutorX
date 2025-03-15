
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, X } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { toast } from 'sonner';

export function VideoUpload() {
  const { user } = useAppSelector(state => state.auth);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please add a title for your video');
      return;
    }
    
    if (!file) {
      toast.error('Please select a video to upload');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      toast.success('Your video has been uploaded successfully');
      setIsUploading(false);
      setIsExpanded(false);
      setTitle('');
      setDescription('');
      setFile(null);
    }, 2000);
  };

  return (
    <Card className="shadow-sm border overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <h3 className="text-lg font-medium">Share your knowledge</h3>
      </CardHeader>
      
      <CardContent className="p-4">
        <AnimatePresence>
          {isExpanded ? (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  placeholder="Title of your video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="input-field"
                />
                <div className="text-xs text-right text-muted-foreground">
                  {title.length}/100
                </div>
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe what you're teaching..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  className="min-h-[100px] resize-none input-field"
                />
                <div className="text-xs text-right text-muted-foreground">
                  {description.length}/500
                </div>
              </div>
              
              <div className="border border-dashed rounded-lg p-4 text-center">
                {file ? (
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Drag & drop or click to upload video
                      </span>
                      <span className="text-xs text-muted-foreground">
                        MP4, WebM or MOV (max. 100MB)
                      </span>
                    </div>
                    <Input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <div className="flex items-center p-2 -m-2 rounded-lg border border-dashed">
              <Button
                onClick={() => setIsExpanded(true)}
                variant="ghost"
                className="w-full h-12 flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create a tutorial video</span>
              </Button>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
