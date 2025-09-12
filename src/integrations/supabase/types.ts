export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bot_players: {
        Row: {
          balance: number
          created_at: string
          daily_income: number
          id: string
          nickname: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          daily_income?: number
          id?: string
          nickname: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          daily_income?: number
          id?: string
          nickname?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_stats: {
        Row: {
          balance_end: number
          balance_start: number
          created_at: string
          daily_income_total: number
          date: string
          id: string
          investments_made: number
          user_id: string
          wells_count: number
        }
        Insert: {
          balance_end?: number
          balance_start?: number
          created_at?: string
          daily_income_total?: number
          date?: string
          id?: string
          investments_made?: number
          user_id: string
          wells_count?: number
        }
        Update: {
          balance_end?: number
          balance_start?: number
          created_at?: string
          daily_income_total?: number
          date?: string
          id?: string
          investments_made?: number
          user_id?: string
          wells_count?: number
        }
        Relationships: []
      }
      game_statistics: {
        Row: {
          created_at: string
          current_value: number
          daily_growth_rate: number
          id: string
          last_updated: string
          stat_name: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          daily_growth_rate?: number
          id?: string
          last_updated?: string
          stat_name: string
        }
        Update: {
          created_at?: string
          current_value?: number
          daily_growth_rate?: number
          id?: string
          last_updated?: string
          stat_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          created_at: string
          daily_income: number
          id: string
          is_banned: boolean
          last_bonus_claim: string | null
          nickname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string
          daily_income?: number
          id?: string
          is_banned?: boolean
          last_bonus_claim?: string | null
          nickname: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string
          daily_income?: number
          id?: string
          is_banned?: boolean
          last_bonus_claim?: string | null
          nickname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_boosters: {
        Row: {
          booster_type: string
          created_at: string
          expires_at: string | null
          id: string
          level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booster_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          level?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booster_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wells: {
        Row: {
          created_at: string
          daily_income: number
          id: string
          level: number
          updated_at: string
          user_id: string
          well_type: string
        }
        Insert: {
          created_at?: string
          daily_income: number
          id?: string
          level?: number
          updated_at?: string
          user_id: string
          well_type: string
        }
        Update: {
          created_at?: string
          daily_income?: number
          id?: string
          level?: number
          updated_at?: string
          user_id?: string
          well_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          balance: number
          created_at: string
          daily_income: number
          nickname: string
          player_type: string
        }[]
      }
      get_user_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_users: number
          banned_users: number
          total_balance: number
          total_users: number
          total_wells: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      record_daily_stats: {
        Args: {
          p_balance_end?: number
          p_balance_start?: number
          p_daily_income_total?: number
          p_investments_made?: number
          p_user_id: string
          p_wells_count?: number
        }
        Returns: undefined
      }
      update_daily_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
