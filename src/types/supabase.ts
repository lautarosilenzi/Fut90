/**
 * Tipos de la base de Supabase, escritos a mano para que coincidan con
 * `supabase/schema.sql`. Cuando el proyecto de Supabase ya exista, se
 * pueden regenerar automáticamente y con más precisión corriendo:
 *
 *   npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/supabase.ts
 *
 * (necesita la Supabase CLI instalada). Hasta entonces, si agregás o
 * cambiás una columna en schema.sql, actualizá también acá a mano.
 *
 * `Relationships: []` en cada tabla no es un error de tipeo: supabase-js
 * lo necesita presente (aunque esté vacío) para poder inferir bien los
 * tipos de `.select()`, `.insert()`, etc.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          match_id: string | null;
          content: string;
          media_urls: string[];
          parent_post_id: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          match_id?: string | null;
          content: string;
          media_urls?: string[];
          parent_post_id?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
        Row: { id: string; user_id: string; post_id: string; created_at: string };
        Insert: { id?: string; user_id: string; post_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["likes"]["Insert"]>;
        Relationships: [];
      };
      reposts: {
        Row: { id: string; user_id: string; post_id: string; created_at: string };
        Insert: { id?: string; user_id: string; post_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["reposts"]["Insert"]>;
        Relationships: [];
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: { follower_id: string; following_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["follows"]["Insert"]>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          post_id: string | null;
          reported_user_id: string | null;
          reason: string;
          details: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          post_id?: string | null;
          reported_user_id?: string | null;
          reason: string;
          details?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
        Relationships: [];
      };
      blocks: {
        Row: { blocker_id: string; blocked_id: string; created_at: string };
        Insert: { blocker_id: string; blocked_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["blocks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
