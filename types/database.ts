export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          fullname: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          fullname?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          fullname?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          created_at: string;
          userid: string;
          title: string;
          ingredients: string;
          instructions: string;
          cooking_time: number;
          difficulty: string;
          category: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          userid: string;
          title: string;
          ingredients: string;
          instructions: string;
          cooking_time: number;
          difficulty: string;
          category: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          userid?: string;
          title?: string;
          ingredients?: string;
          instructions?: string;
          cooking_time?: number;
          difficulty?: string;
          category?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

