import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateUserProfile } from '@/store/slices/authSlice';
import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const EditProfile = () => {
  const { user, isLoading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | undefined>(undefined);
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
      setHourlyRate(user.hourlyRate);
      setIsTutor(user.isTutor);
    }
  }, [user]);

  // Redirect to login if not authenticated and not loading
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setAvatarFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you'd upload this to a server
      // For now, we'll simulate it by setting the avatarUrl to the file name
      // In a real implementation, this would be an API call to upload the file
      
      // Simulate a URL that would be returned from the server
      const fakeUploadedUrl = `https://storage.example.com/avatars/${file.name}`;
      setAvatarUrl(fakeUploadedUrl);
      
      toast.success('Avatar uploaded successfully');
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would upload the file here if it exists
    // For demo, we'll just use the simulated URL
    
    const updatedProfile = {
      name,
      email,
      bio,
      avatarUrl: avatarPreview || avatarUrl, // Use the preview URL for immediate feedback
      isTutor,
      hourlyRate: isTutor ? hourlyRate : undefined,
    };
    
    dispatch(updateUserProfile(updatedProfile));
    toast.success('Profile updated successfully');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage 
                    src={avatarPreview || avatarUrl} 
                    alt={name} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {(avatarPreview || avatarUrl) && (
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                    onClick={removeAvatar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileUpload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Avatar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isTutor" className="cursor-pointer">Are you willing to provide tutoring services?</Label>
              <Switch
                id="isTutor"
                checked={isTutor}
                onCheckedChange={setIsTutor}
              />
            </div>
            
            {isTutor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate || ''}
                  onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="50"
                  required={isTutor}
                  min={1}
                />
              </motion.div>
            )}
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditProfile;

