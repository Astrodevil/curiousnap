export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      discoveries: {
        Row: {
          created_at: string | null
          fact: string
          id: string
          image_url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          fact: string
          id?: string
          image_url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          fact?: string
          id?: string
          image_url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          id: string
          platform: string
          share_count: number | null
          shared_at: string | null
          tool_id: string | null
        }
        Insert: {
          id?: string
          platform: string
          share_count?: number | null
          shared_at?: string | null
          tool_id?: string | null
        }
        Update: {
          id?: string
          platform?: string
          share_count?: number | null
          shared_at?: string | null
          tool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          available_languages: string[] | null
          category: string
          construction_year: string | null
          description: string
          historical_events: Json | null
          id: string
          logo: string | null
          name: string
          pricing: string | null
          sponsored: boolean | null
          status: string | null
          submitted_at: string | null
          url: string
          virtual_tour_url: string | null
          weather_info: Json | null
        }
        Insert: {
          available_languages?: string[] | null
          category: string
          construction_year?: string | null
          description: string
          historical_events?: Json | null
          id?: string
          logo?: string | null
          name: string
          pricing?: string | null
          sponsored?: boolean | null
          status?: string | null
          submitted_at?: string | null
          url: string
          virtual_tour_url?: string | null
          weather_info?: Json | null
        }
        Update: {
          available_languages?: string[] | null
          category?: string
          construction_year?: string | null
          description?: string
          historical_events?: Json | null
          id?: string
          logo?: string | null
          name?: string
          pricing?: string | null
          sponsored?: boolean | null
          status?: string | null
          submitted_at?: string | null
          url?: string
          virtual_tour_url?: string | null
          weather_info?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
