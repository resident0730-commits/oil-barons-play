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
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          reward_amount: number
          reward_data: Json | null
          reward_type: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          reward_amount?: number
          reward_data?: Json | null
          reward_type: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          reward_amount?: number
          reward_data?: Json | null
          reward_type?: string
          title?: string
        }
        Relationships: []
      }
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
      exchange_rates: {
        Row: {
          created_at: string
          from_currency: string
          id: string
          is_active: boolean
          rate: number
          to_currency: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          from_currency: string
          id?: string
          is_active?: boolean
          rate: number
          to_currency: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          from_currency?: string
          id?: string
          is_active?: boolean
          rate?: number
          to_currency?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      exchange_transactions: {
        Row: {
          created_at: string
          exchange_rate: number
          from_amount: number
          from_currency: string
          id: string
          to_amount: number
          to_currency: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exchange_rate: number
          from_amount: number
          from_currency: string
          id?: string
          to_amount: number
          to_currency: string
          user_id: string
        }
        Update: {
          created_at?: string
          exchange_rate?: number
          from_amount?: number
          from_currency?: string
          id?: string
          to_amount?: number
          to_currency?: string
          user_id?: string
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
      money_transfers: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          description: string | null
          from_user_id: string
          id: string
          status: string
          to_user_id: string
          transfer_type: string
          updated_at: string | null
          withdrawal_details: Json | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          description?: string | null
          from_user_id: string
          id?: string
          status?: string
          to_user_id: string
          transfer_type?: string
          updated_at?: string | null
          withdrawal_details?: Json | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          description?: string | null
          from_user_id?: string
          id?: string
          status?: string
          to_user_id?: string
          transfer_type?: string
          updated_at?: string | null
          withdrawal_details?: Json | null
        }
        Relationships: []
      }
      payment_invoices: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          id: string
          invoice_id: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          id?: string
          invoice_id: string
          status?: string
          total_amount?: number
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          invoice_id?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          barrel_balance: number
          created_at: string
          daily_chest_streak: number | null
          daily_income: number
          id: string
          is_banned: boolean
          last_barrel_claim: string | null
          last_bonus_claim: string | null
          last_daily_chest_claim: string | null
          last_login: string | null
          nickname: string
          oilcoin_balance: number
          referral_bonus_expires_at: string | null
          referral_code: string | null
          referred_by: string | null
          ruble_balance: number
          status_titles: string[] | null
          total_daily_chests_opened: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          barrel_balance?: number
          created_at?: string
          daily_chest_streak?: number | null
          daily_income?: number
          id?: string
          is_banned?: boolean
          last_barrel_claim?: string | null
          last_bonus_claim?: string | null
          last_daily_chest_claim?: string | null
          last_login?: string | null
          nickname: string
          oilcoin_balance?: number
          referral_bonus_expires_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          ruble_balance?: number
          status_titles?: string[] | null
          total_daily_chests_opened?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          barrel_balance?: number
          created_at?: string
          daily_chest_streak?: number | null
          daily_income?: number
          id?: string
          is_banned?: boolean
          last_barrel_claim?: string | null
          last_bonus_claim?: string | null
          last_daily_chest_claim?: string | null
          last_login?: string | null
          nickname?: string
          oilcoin_balance?: number
          referral_bonus_expires_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          ruble_balance?: number
          status_titles?: string[] | null
          total_daily_chests_opened?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_code_usage: {
        Row: {
          bonus_received: number
          id: string
          invoice_id: string | null
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          bonus_received: number
          id?: string
          invoice_id?: string | null
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          bonus_received?: number
          id?: string
          invoice_id?: string | null
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_usage_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "payment_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          bonus_amount: number
          code: string
          created_at: string
          created_by: string
          current_uses: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          updated_at: string
        }
        Insert: {
          bonus_amount?: number
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Update: {
          bonus_amount?: number
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      referral_rewards_claimed: {
        Row: {
          claimed_at: string
          id: string
          reward_amount: number
          reward_tier: number
          user_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          reward_amount: number
          reward_tier: number
          user_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          reward_amount?: number
          reward_tier?: number
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_earned: number
          created_at: string
          id: string
          is_active: boolean
          referral_code: string
          referred_id: string
          referrer_id: string
          updated_at: string
        }
        Insert: {
          bonus_earned?: number
          created_at?: string
          id?: string
          is_active?: boolean
          referral_code: string
          referred_id: string
          referrer_id: string
          updated_at?: string
        }
        Update: {
          bonus_earned?: number
          created_at?: string
          id?: string
          is_active?: boolean
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          attachments: string[] | null
          category: string
          created_at: string
          id: string
          message: string
          priority: string
          resolved_at: string | null
          responded_by: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          attachments?: string[] | null
          category?: string
          created_at?: string
          id?: string
          message: string
          priority?: string
          resolved_at?: string | null
          responded_by?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          attachments?: string[] | null
          category?: string
          created_at?: string
          id?: string
          message?: string
          priority?: string
          resolved_at?: string | null
          responded_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          claimed: boolean
          claimed_at: string | null
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          claimed?: boolean
          claimed_at?: string | null
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          claimed?: boolean
          claimed_at?: string | null
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
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
      add_user_balance: {
        Args: { amount_to_add: number; user_id: string }
        Returns: undefined
      }
      apply_promo_code: {
        Args: { p_code: string; p_invoice_id: string; p_user_id: string }
        Returns: Json
      }
      calculate_status_multiplier: {
        Args: { user_titles: string[] }
        Returns: number
      }
      check_and_award_referral_milestones: {
        Args: { p_referrer_id: string }
        Returns: undefined
      }
      claim_accumulated_barrels: { Args: { p_user_id: string }; Returns: Json }
      exchange_currency: {
        Args: {
          p_from_amount: number
          p_from_currency: string
          p_to_currency: string
          p_user_id: string
        }
        Returns: Json
      }
      fix_well_income: { Args: never; Returns: undefined }
      generate_referral_code: { Args: never; Returns: string }
      get_leaderboard: {
        Args: never
        Returns: {
          balance: number
          created_at: string
          daily_income: number
          nickname: string
          player_type: string
        }[]
      }
      get_user_statistics: {
        Args: never
        Returns: {
          active_users: number
          banned_users: number
          total_balance: number
          total_users: number
          total_wells: number
        }[]
      }
      get_user_transfers: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          created_by: string
          description: string
          from_user_id: string
          id: string
          status: string
          to_user_id: string
          transfer_type: string
          updated_at: string
          withdrawal_details: Json
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_referral_code: {
        Args: { code: string }
        Returns: {
          nickname: string
          referral_code: string
          user_id: string
        }[]
      }
      process_withdrawal: {
        Args: { p_admin_id?: string; p_status: string; p_transfer_id: string }
        Returns: boolean
      }
      recalculate_well_income: { Args: never; Returns: undefined }
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
      transfer_money: {
        Args: {
          p_admin_id?: string
          p_amount: number
          p_description?: string
          p_from_user_id: string
          p_to_user_id: string
        }
        Returns: boolean
      }
      update_daily_statistics: { Args: never; Returns: undefined }
      update_referral_bonus: {
        Args: { earned_amount: number; referrer_user_id: string }
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
