import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  isTutor: boolean;
  hourlyRate?: number;
  description?: string;
  favorite?: boolean;
  rating?: number;
  totalRatings?: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  liked: boolean;
  followed: boolean;
  comments: Comment[];
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  favoriteTutors: Author[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: PostsState = {
  posts: [
    {
      id: '1',
      author: {
        id: '101',
        name: 'Jane Smith',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        isTutor: true,
        hourlyRate: 50,
        rating: 4.8,
        totalRatings: 24,
      },
      title: 'Linear Algebra Made Easy',
      description: 'Understanding matrix operations and their applications in computer science and data analysis.',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
      likes: 250,
      comments: [
        {
          id: 'c1',
          postId: '1',
          author: {
            id: '102',
            name: 'Robert Chen',
            avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
            isTutor: true,
          },
          text: 'This explanation really helped me understand determinants better!',
          createdAt: '2023-10-15T14:22:00Z',
        },
      ],
      liked: false,
      followed: false,
      createdAt: '2023-10-15T14:22:00Z',
    },
    {
      id: '2',
      author: {
        id: '102',
        name: 'Robert Chen',
        avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
        isTutor: true,
        hourlyRate: 65,
        rating: 4.5,
        totalRatings: 18,
      },
      title: 'Advanced Calculus Techniques',
      description: 'Mastering differentiation and integration for complex functions with real-world applications.',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1596496181871-9681eacf9764',
      likes: 183,
      comments: [
        {
          id: 'c2',
          postId: '2',
          author: {
            id: '103',
            name: 'Maria Rodriguez',
            avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
            isTutor: false,
          },
          text: 'Your explanation of integration by parts was so clear!',
          createdAt: '2023-10-16T09:15:00Z',
        },
      ],
      liked: false,
      followed: false,
      createdAt: '2023-10-16T09:15:00Z',
    },
    {
      id: '3',
      author: {
        id: '103',
        name: 'Maria Rodriguez',
        avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
        isTutor: false,
      },
      title: 'My Journey Learning Data Science',
      description: 'Sharing my experience transitioning from a non-technical background to data science and machine learning.',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
      likes: 412,
      comments: [
        {
          id: 'c3',
          postId: '3',
          author: {
            id: '101',
            name: 'Jane Smith',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            isTutor: true,
          },
          text: "Thanks for sharing your journey! It's inspiring for other career-changers.",
          createdAt: '2023-10-17T16:45:00Z',
        },
      ],
      liked: false,
      followed: false,
      createdAt: '2023-10-17T16:45:00Z',
    },
  ],
  favoriteTutors: [],
  isLoading: false,
  error: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPostsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    likePost: (state, action: PayloadAction<{ postId: string, userId: string }>) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        if (post.liked) {
          post.likes -= 1;
          post.liked = false;
        } else {
          post.likes += 1;
          post.liked = true;
        }
      }
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload);
      }
    },
    followAuthor: (state, action: PayloadAction<{ postId: string, follow: boolean }>) => {
      const { postId, follow } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.followed = follow;
      }
    },
    toggleFavorite: (state, action: PayloadAction<{ authorId: string; favorite: boolean }>) => {
      const { authorId, favorite } = action.payload;
      
      // Update in posts
      state.posts.forEach(post => {
        if (post.author.id === authorId) {
          post.author.favorite = favorite;
        }
      });
      
      // Update favorite tutors list
      if (favorite) {
        const authorToAdd = state.posts.find(post => post.author.id === authorId)?.author;
        if (authorToAdd && !state.favoriteTutors.some(tutor => tutor.id === authorId)) {
          state.favoriteTutors.push(authorToAdd);
        }
      } else {
        state.favoriteTutors = state.favoriteTutors.filter(tutor => tutor.id !== authorId);
      }
    },
    updateTutorRating: (state, action: PayloadAction<{ tutorId: string, rating: number }>) => {
      const { tutorId, rating } = action.payload;
      
      // Update rating in posts
      state.posts.forEach(post => {
        if (post.author.id === tutorId && post.author.isTutor) {
          // Initialize rating and totalRatings if they don't exist
          if (!post.author.rating) {
            post.author.rating = rating;
            post.author.totalRatings = 1;
          } else {
            // Simple averaging calculation
            const currentTotal = (post.author.rating * (post.author.totalRatings || 1));
            post.author.totalRatings = (post.author.totalRatings || 0) + 1;
            post.author.rating = (currentTotal + rating) / post.author.totalRatings;
          }
        }
      });
      
      // Also update in favoriteTutors if present
      const favoriteIndex = state.favoriteTutors.findIndex(tutor => tutor.id === tutorId);
      if (favoriteIndex >= 0) {
        const tutor = state.favoriteTutors[favoriteIndex];
        if (!tutor.rating) {
          tutor.rating = rating;
          tutor.totalRatings = 1;
        } else {
          const currentTotal = (tutor.rating * (tutor.totalRatings || 1));
          tutor.totalRatings = (tutor.totalRatings || 0) + 1;
          tutor.rating = (currentTotal + rating) / tutor.totalRatings;
        }
      }
    }
  },
});

export const { 
  setPostsLoading, 
  setPostsError, 
  setPosts, 
  likePost, 
  addComment, 
  followAuthor,
  toggleFavorite,
  updateTutorRating
} = postsSlice.actions;

export default postsSlice.reducer;
