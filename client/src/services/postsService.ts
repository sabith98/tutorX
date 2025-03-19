import api from "./api";
import { Author, Comment, Post } from "@/store/slices/postsSlice";

export interface CreatePostData {
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<{ success: boolean; data: Post[] }>("/posts");
  const one_data = response.data.data[0];
  console.log(response.data.data);
  console.log(one_data.id);
  return response.data.data;
};

export const getPostById = async (postId: string): Promise<Post> => {
  const response = await api.get<{ post: Post }>(`/posts/${postId}`);
  return response.data.post;
};

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  const response = await api.get<{ posts: Post[] }>(`/posts/user/${userId}`);
  return response.data.posts;
};

export const createPost = async (postData: CreatePostData): Promise<Post> => {
  const response = await api.post<{ post: Post }>("/posts", postData);
  return response.data.post;
};

export const updatePost = async (
  postId: string,
  postData: Partial<CreatePostData>
): Promise<Post> => {
  const response = await api.put<{ post: Post }>(`/posts/${postId}`, postData);
  return response.data.post;
};

export const deletePost = async (
  postId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId: string): Promise<{ liked: boolean }> => {
  const response = await api.put<{ liked: boolean }>(`/posts/${postId}/like`);
  return response.data;
};

// Comment related endpoints
export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await api.get<{ comments: Comment[] }>(
    `/comments/post/${postId}`
  );
  return response.data.comments;
};

export const addComment = async (
  postId: string,
  text: string
): Promise<Comment> => {
  const response = await api.post<{ comment: Comment }>("/comments", {
    postId,
    text,
  });
  return response.data.comment;
};

export const deleteComment = async (
  commentId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/comments/${commentId}`
  );
  return response.data;
};
