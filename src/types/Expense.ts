// src/types/Expense.ts

// Interface for the User object
export interface IUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string; // Optional, as it might not always be present
}

// Interface for the Expense object
export interface IExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // Storing date as string for simplicity, can be Date object
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Type for the authentication context state and actions
export interface AuthContextType {
  user: IUser | null; // Currently logged-in user
  token: string | null; // JWT token
  loading: boolean; // Loading state for auth operations
  login: (email: string, password: string) => Promise<void>; // Login function
  register: (name: string, email: string, password: string) => Promise<void>; // Register function
  logout: () => void; // Logout function
  updateUserProfilePic: (file: File) => Promise<void>; // Function to update profile picture
  fetchUserProfile: () => Promise<void>; // Function to refetch user profile
}

// Type for the page navigation
export type Page = 'home' | 'login' | 'register' | 'dashboard';
