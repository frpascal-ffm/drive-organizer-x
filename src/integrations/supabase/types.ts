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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      company_costs: {
        Row: {
          amount: number
          cost_type: string
          created_at: string | null
          date_from: string | null
          date_to: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          period: string
          updated_at: string | null
          user_id: string
          vat_deductible: boolean | null
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          cost_type?: string
          created_at?: string | null
          date_from?: string | null
          date_to?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          period?: string
          updated_at?: string | null
          user_id: string
          vat_deductible?: boolean | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          cost_type?: string
          created_at?: string | null
          date_from?: string | null
          date_to?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          period?: string
          updated_at?: string | null
          user_id?: string
          vat_deductible?: boolean | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_costs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          calculate_from_payout: boolean | null
          city: string | null
          company_address: string | null
          company_email: string | null
          company_name: string | null
          company_phone: string | null
          created_at: string | null
          default_driver_share: number | null
          include_vehicle_costs: boolean | null
          postal_code: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calculate_from_payout?: boolean | null
          city?: string | null
          company_address?: string | null
          company_email?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string | null
          default_driver_share?: number | null
          include_vehicle_costs?: boolean | null
          postal_code?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calculate_from_payout?: boolean | null
          city?: string | null
          company_address?: string | null
          company_email?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string | null
          default_driver_share?: number | null
          include_vehicle_costs?: boolean | null
          postal_code?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          address: string | null
          created_at: string | null
          default_vehicle_id: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          name: string | null
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          default_vehicle_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          default_vehicle_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_default_vehicle_id_fkey"
            columns: ["default_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_imports: {
        Row: {
          created_at: string | null
          filename: string | null
          id: string
          import_date: string | null
          notes: string | null
          period_from: string | null
          period_to: string | null
          platform: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filename?: string | null
          id?: string
          import_date?: string | null
          notes?: string | null
          period_from?: string | null
          period_to?: string | null
          platform: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filename?: string | null
          id?: string
          import_date?: string | null
          notes?: string | null
          period_from?: string | null
          period_to?: string | null
          platform?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_revenues: {
        Row: {
          amount: number
          commission: number | null
          created_at: string | null
          driver_id: string | null
          id: string
          import_id: string | null
          net_amount: number | null
          period_from: string | null
          period_to: string | null
          platform: string
          reference: string | null
          trip_count: number | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          commission?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          import_id?: string | null
          net_amount?: number | null
          period_from?: string | null
          period_to?: string | null
          platform: string
          reference?: string | null
          trip_count?: number | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          commission?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          import_id?: string | null
          net_amount?: number | null
          period_from?: string | null
          period_to?: string | null
          platform?: string
          reference?: string | null
          trip_count?: number | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_revenues_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_revenues_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "platform_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_revenues_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_comments: {
        Row: {
          created_at: string | null
          id: string
          text: string
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          text: string
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          text?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_comments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_types: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          amount: number
          created_at: string | null
          destination_address: string | null
          driver_id: string | null
          id: string
          is_paid: boolean
          notes: string | null
          passenger_name: string | null
          pickup_address: string | null
          status: string
          trip_date: string
          trip_type_id: string | null
          updated_at: string | null
          user_id: string
          vat_rate: number | null
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string | null
          destination_address?: string | null
          driver_id?: string | null
          id?: string
          is_paid?: boolean
          notes?: string | null
          passenger_name?: string | null
          pickup_address?: string | null
          status?: string
          trip_date: string
          trip_type_id?: string | null
          updated_at?: string | null
          user_id: string
          vat_rate?: number | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          destination_address?: string | null
          driver_id?: string | null
          id?: string
          is_paid?: boolean
          notes?: string | null
          passenger_name?: string | null
          pickup_address?: string | null
          status?: string
          trip_date?: string
          trip_type_id?: string | null
          updated_at?: string | null
          user_id?: string
          vat_rate?: number | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_trip_type_id_fkey"
            columns: ["trip_type_id"]
            isOneToOne: false
            referencedRelation: "trip_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string | null
          fuel_type: string | null
          id: string
          license_plate: string
          make: string | null
          model: string | null
          name: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          license_plate: string
          make?: string | null
          model?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string
          make?: string | null
          model?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number | null
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
    Enums: {},
  },
} as const
