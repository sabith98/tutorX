import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as postsService from "@/services/postsService";
import * as userService from "@/services/userService";
import { toast } from "sonner";

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

// Initial state with empty data that will be fetched from API
const initialState: PostsState = {
  posts: [],
  favoriteTutors: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await postsService.getPosts();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchPostsByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await postsService.getPostsByUser(userId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData: postsService.CreatePostData, { rejectWithValue }) => {
    try {
      return await postsService.createPost(postData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const likePostAsync = createAsyncThunk(
  "posts/likePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const result = await postsService.likePost(postId);
      return { postId, liked: result.liked };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like post"
      );
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  "posts/addComment",
  async (
    { postId, text }: { postId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      return await postsService.addComment(postId, text);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const fetchFavoriteTutors = createAsyncThunk(
  "posts/fetchFavoriteTutors",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getFavorites();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch favorite tutors"
      );
    }
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  "posts/toggleFavorite",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      const result = await userService.toggleFavorite(tutorId);
      return { tutorId, isFavorite: result.isFavorite };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle favorite"
      );
    }
  }
);

export const rateTutorAsync = createAsyncThunk(
  "posts/rateTutor",
  async (ratingData: userService.RatingData, { rejectWithValue }) => {
    try {
      await userService.rateTutor(ratingData);
      return ratingData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to rate tutor"
      );
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
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
    likePost: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
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
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload);
      }
    },
    followAuthor: (
      state,
      action: PayloadAction<{ postId: string; follow: boolean }>
    ) => {
      const { postId, follow } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.followed = follow;
      }
    },
    updateTutorRating: (
      state,
      action: PayloadAction<{ tutorId: string; rating: number }>
    ) => {
      const { tutorId, rating } = action.payload;

      // Update rating in posts
      state.posts.forEach((post) => {
        if (post.author.id === tutorId && post.author.isTutor) {
          // Initialize rating and totalRatings if they don't exist
          if (!post.author.rating) {
            post.author.rating = rating;
            post.author.totalRatings = 1;
          } else {
            // Simple averaging calculation
            const currentTotal =
              post.author.rating * (post.author.totalRatings || 1);
            post.author.totalRatings = (post.author.totalRatings || 0) + 1;
            post.author.rating =
              (currentTotal + rating) / post.author.totalRatings;
          }
        }
      });

      // Also update in favoriteTutors if present
      const favoriteIndex = state.favoriteTutors.findIndex(
        (tutor) => tutor.id === tutorId
      );
      if (favoriteIndex >= 0) {
        const tutor = state.favoriteTutors[favoriteIndex];
        if (!tutor.rating) {
          tutor.rating = rating;
          tutor.totalRatings = 1;
        } else {
          const currentTotal = tutor.rating * (tutor.totalRatings || 1);
          tutor.totalRatings = (tutor.totalRatings || 0) + 1;
          tutor.rating = (currentTotal + rating) / tutor.totalRatings;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error || "Failed to fetch posts");
      })

      // Fetch Posts by User
      .addCase(fetchPostsByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // We're not replacing all posts, just showing user posts in a specific view
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error || "Failed to fetch user posts");
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
        toast.success("Post created successfully");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error || "Failed to create post");
      })

      // Like Post
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const { postId, liked } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.liked = liked;
          post.likes = liked ? post.likes + 1 : post.likes - 1;
        }
      })
      .addCase(likePostAsync.rejected, (state, action) => {
        toast.error((action.payload as string) || "Failed to like post");
      })

      // Add Comment
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        const comment = action.payload;
        const post = state.posts.find((p) => p.id === comment.postId);
        if (post) {
          post.comments.push(comment);
        }
        toast.success("Comment added");
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        toast.error((action.payload as string) || "Failed to add comment");
      })

      // Fetch Favorite Tutors
      .addCase(fetchFavoriteTutors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteTutors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteTutors = action.payload;
      })
      .addCase(fetchFavoriteTutors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Toggle Favorite
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const { tutorId, isFavorite } = action.payload;

        // Update favorite status in posts
        state.posts.forEach((post) => {
          if (post.author.id === tutorId) {
            post.author.favorite = isFavorite;
          }
        });

        // Update favorite tutors list
        if (isFavorite) {
          const authorToAdd = state.posts.find(
            (post) => post.author.id === tutorId
          )?.author;
          if (
            authorToAdd &&
            !state.favoriteTutors.some((tutor) => tutor.id === tutorId)
          ) {
            state.favoriteTutors.push(authorToAdd);
          }
        } else {
          state.favoriteTutors = state.favoriteTutors.filter(
            (tutor) => tutor.id !== tutorId
          );
        }

        toast.success(
          isFavorite ? "Added to favorites" : "Removed from favorites"
        );
      })
      .addCase(toggleFavoriteAsync.rejected, (state, action) => {
        toast.error((action.payload as string) || "Failed to update favorites");
      })

      // Rate Tutor
      .addCase(rateTutorAsync.fulfilled, (state, action) => {
        const { tutorId, rating } = action.payload;

        // Update rating in posts and favorites using the existing reducer
        state.posts.forEach((post) => {
          if (post.author.id === tutorId && post.author.isTutor) {
            if (!post.author.rating) {
              post.author.rating = rating;
              post.author.totalRatings = 1;
            } else {
              const currentTotal =
                post.author.rating * (post.author.totalRatings || 1);
              post.author.totalRatings = (post.author.totalRatings || 0) + 1;
              post.author.rating =
                (currentTotal + rating) / post.author.totalRatings;
            }
          }
        });

        // Also update in favoriteTutors if present
        const favoriteIndex = state.favoriteTutors.findIndex(
          (tutor) => tutor.id === tutorId
        );
        if (favoriteIndex >= 0) {
          const tutor = state.favoriteTutors[favoriteIndex];
          if (!tutor.rating) {
            tutor.rating = rating;
            tutor.totalRatings = 1;
          } else {
            const currentTotal = tutor.rating * (tutor.totalRatings || 1);
            tutor.totalRatings = (tutor.totalRatings || 0) + 1;
            tutor.rating = (currentTotal + rating) / tutor.totalRatings;
          }
        }

        toast.success("Rating submitted successfully");
      })
      .addCase(rateTutorAsync.rejected, (state, action) => {
        toast.error((action.payload as string) || "Failed to submit rating");
      });
  },
});

export const {
  setPostsLoading,
  setPostsError,
  setPosts,
  likePost,
  addComment,
  followAuthor,
  updateTutorRating,
} = postsSlice.actions;

export default postsSlice.reducer;
