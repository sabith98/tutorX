import { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { Header } from '@/components/Header';
import { ProfileCard } from '@/components/ProfileCard';
import { VideoPost } from '@/components/VideoPost';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';

const Profile = () => {
  const { user, isLoading } = useAppSelector(state => state.auth);
  const { posts, favoriteTutors } = useAppSelector(state => state.posts);

  // Filter posts created by the current user
  const userPosts = posts.filter(post => post.author.id === user?.id);

  // Redirect to login if not authenticated and not loading
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile column */}
          <div className="md:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileCard editable />
            </motion.div>
            
            {/* Favorites section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Star className="text-yellow-500 fill-yellow-500 h-5 w-5 mr-2" /> 
                    Favorites
                  </CardTitle>
                  <CardDescription>Tutors and learners you've marked as favorites</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteTutors.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      You haven't added any favorites yet
                    </p>
                  ) : (
                    <ScrollArea className="h-[250px] pr-4">
                      <div className="space-y-4">
                        {favoriteTutors.map(tutor => (
                          <Link 
                            to={`/user/${tutor.id}`} 
                            key={tutor.id}
                            className="flex items-center p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={tutor.avatarUrl} alt={tutor.name} />
                              <AvatarFallback>
                                {tutor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                              <h4 className="text-sm font-medium">{tutor.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {tutor.isTutor ? 'Tutor' : 'Learner'}
                                {tutor.isTutor && tutor.hourlyRate && ` • $${tutor.hourlyRate}/hr`}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* User's posts column */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-4">My Posts</h2>
              {userPosts.length === 0 ? (
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">You haven't created any posts yet.</p>
                </div>
              ) : (
                userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <VideoPost post={post} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
