import api from "./api";
import { Author } from "@/store/slices/postsSlice";

export interface RatingData {
  tutorId: string;
  rating: number;
  feedback?: string;
}

export const getTutors = async (): Promise<Author[]> => {
  const response = await api.get<{ tutors: Author[] }>("/users/tutors");
  return response.data.tutors;
};

export const getUserById = async (userId: string): Promise<Author> => {
  const response = await api.get<{ user: Author }>(`/users/${userId}`);
  return response.data.user;
};

export const getUserRatings = async (
  userId: string
): Promise<
  {
    rating: number;
    feedback: string;
    createdAt: string;
    rater: { name: string };
  }[]
> => {
  const response = await api.get<{
    ratings: {
      rating: number;
      feedback: string;
      createdAt: string;
      rater: { name: string };
    }[];
  }>(`/users/${userId}/ratings`);
  return response.data.ratings;
};

export const rateTutor = async (
  ratingData: RatingData
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    "/users/rate",
    ratingData
  );
  return response.data;
};

export const toggleFavorite = async (
  tutorId: string
): Promise<{ isFavorite: boolean }> => {
  const response = await api.post<{ isFavorite: boolean }>(
    `/users/favorite/${tutorId}`
  );
  return response.data;
};

export const getFavorites = async (): Promise<Author[]> => {
  const response = await api.get<{ favorites: Author[] }>("/users/favorites");
  return response.data.favorites;
};
