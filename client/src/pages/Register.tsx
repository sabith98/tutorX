import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { register } from '@/store/slices/authSlice';
import AuthLayout from '@/components/AuthLayout';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTutor, setIsTutor] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<number | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userData = {
        name,
        email,
        password,
        isTutor,
        hourlyRate: isTutor ? hourlyRate : undefined
      };
      
      const resultAction = await dispatch(register(userData)).unwrap();
      if (resultAction) {
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in the auth slice
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your information to get started"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
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
              placeholder="50"
              value={hourlyRate || ''}
              onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : undefined)}
              required={isTutor}
              min={1}
              className="input-field"
            />
          </motion.div>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating account...</span>
            </div>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
