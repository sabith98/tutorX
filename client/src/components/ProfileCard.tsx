
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/redux';
import { User, Settings, Star, MessageSquare } from 'lucide-react';

type ProfileCardProps = {
  editable?: boolean;
  showFavorites?: boolean;
};

export function ProfileCard({ editable = true, showFavorites = false }: ProfileCardProps) {
  const { user } = useAppSelector(state => state.auth);
  const { favoriteTutors } = useAppSelector(state => state.posts);
  const navigate = useNavigate();

  if (!user) return null;

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="shadow-sm border overflow-hidden">
      <CardHeader className="pb-0">
        <div className="h-32 -mt-6 -mx-6 bg-gradient-to-r from-blue-500 to-primary"></div>
        <div className="-mt-12 flex flex-col items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="space-y-1 text-center mt-4">
            <h3 className="text-2xl font-medium">{user.name}</h3>
            <p className="text-muted-foreground text-sm">
              {user.isTutor ? 'Tutor' : 'Learner'}
              {user.isTutor && user.hourlyRate && ` • $${user.hourlyRate}/hr`}
            </p>
          </div>
          {user.bio && (
            <p className="text-sm text-center mt-2 text-muted-foreground">
              {user.bio}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-center gap-8 text-center mb-6">
          <div className="flex flex-col">
            <span className="text-2xl font-medium">{user.followers}</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-medium">{user.following}</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start px-3 py-2 h-auto"
            onClick={() => handleNavigation('/profile')}
          >
            <User className="h-4 w-4 mr-2" />
            <span>Profile</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start px-3 py-2 h-auto"
            onClick={() => handleNavigation('/settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start px-3 py-2 h-auto"
            onClick={() => handleNavigation('/profile')}
          >
            <Star className="h-4 w-4 mr-2" />
            <span>Favorites</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start px-3 py-2 h-auto"
            onClick={() => handleNavigation('/messages')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Messages</span>
          </Button>
        </div>
      </CardContent>
      {editable && (
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
