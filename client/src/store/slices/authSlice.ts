import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  isTutor: boolean;
  hourlyRate?: number;
  followers: number;
  following: number;
  bio?: string;
  avatarUrl?: string;
};

// Demo users for login simulation
const DEMO_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
    isTutor: true,
    hourlyRate: 50,
    followers: 120,
    following: 45,
    bio: 'Mathematics tutor with 5 years of experience.',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password',
    isTutor: false,
    followers: 30,
    following: 67,
    bio: 'Engineering student looking to learn advanced math.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

// Load user from localStorage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      initialState.user = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem('user');
    }
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
  },
});

export const { setUser, setLoading, logoutUser } = authSlice.actions;

// Async thunk for login
export const login = (email: string, password: string) => async (dispatch: any) => {
  dispatch(setLoading(true));

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = DEMO_USERS.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      dispatch(setUser(userWithoutPassword));
      toast.success('Logged in successfully');
      return true;
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid email or password');
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export const register = (
  name: string, 
  email: string, 
  password: string, 
  isTutor: boolean, 
  hourlyRate?: number
) => async (dispatch: any) => {
  dispatch(setLoading(true));
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (DEMO_USERS.some(u => u.email === email)) {
      toast.error('Email already registered');
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      isTutor,
      hourlyRate: isTutor ? hourlyRate : undefined,
      followers: 0,
      following: 0,
    };
    
    dispatch(setUser(newUser));
    toast.success('Account created successfully');
    return true;
  } finally {
    dispatch(setLoading(false));
  }
};

export const resetPassword = (email: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userExists = DEMO_USERS.some(u => u.email === email);
    
    if (userExists) {
      toast.success('Password reset link sent to your email');
      return true;
    } else {
      toast.error('Email not found');
      throw new Error('Email not found');
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
