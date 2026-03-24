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
          period: string
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
          retroactive_start_year: number | null
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
          retroactive_start_year?: number | null
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
          retroactive_start_year?: number | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      compensation_variants: {
        Row: {
          created_at: string | null
          formula: Json
          id: string
          is_active: boolean | null
          name: string
          percentage: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          formula: Json
          id?: string
          is_active?: boolean | null
          name: string
          percentage?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          formula?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          percentage?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          compensation_amount: number | null
          compensation_percent: number | null
          compensation_type: string | null
          compensation_variant_id: string | null
          created_at: string | null
          default_vehicle_id: string | null
          driver_id: string | null
          driver_uuid: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compensation_amount?: number | null
          compensation_percent?: number | null
          compensation_type?: string | null
          compensation_variant_id?: string | null
          created_at?: string | null
          default_vehicle_id?: string | null
          driver_id?: string | null
          driver_uuid?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compensation_amount?: number | null
          compensation_percent?: number | null
          compensation_type?: string | null
          compensation_variant_id?: string | null
          created_at?: string | null
          default_vehicle_id?: string | null
          driver_id?: string | null
          driver_uuid?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_compensation_variant_id_fkey"
            columns: ["compensation_variant_id"]
            isOneToOne: false
            referencedRelation: "compensation_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_default_vehicle_id_fkey"
            columns: ["default_vehicle_id"]
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
      revenues: {
        Row: {
          airport_fee: number | null
          company_share: number | null
          created_at: string | null
          driver_id: string
          driver_share: number | null
          driver_uuid: string | null
          first_name: string | null
          id: string
          last_name: string | null
          net_fare: number | null
          payout: number | null
          payout_bank: number | null
          payout_cash: number | null
          promotions: number | null
          refunds: number | null
          taxes: number | null
          tips: number | null
          total_revenue: number | null
          trip_type_id: string | null
          updated_at: string | null
          user_id: string
          week_end_date: string | null
          week_label: string
          week_number: number | null
          week_start_date: string | null
          week_year: number | null
        }
        Insert: {
          airport_fee?: number | null
          company_share?: number | null
          created_at?: string | null
          driver_id: string
          driver_share?: number | null
          driver_uuid?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          net_fare?: number | null
          payout?: number | null
          payout_bank?: number | null
          payout_cash?: number | null
          promotions?: number | null
          refunds?: number | null
          taxes?: number | null
          tips?: number | null
          total_revenue?: number | null
          trip_type_id?: string | null
          updated_at?: string | null
          user_id: string
          week_end_date?: string | null
          week_label: string
          week_number?: number | null
          week_start_date?: string | null
          week_year?: number | null
        }
        Update: {
          airport_fee?: number | null
          company_share?: number | null
          created_at?: string | null
          driver_id?: string
          driver_share?: number | null
          driver_uuid?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          net_fare?: number | null
          payout?: number | null
          payout_bank?: number | null
          payout_cash?: number | null
          promotions?: number | null
          refunds?: number | null
          taxes?: number | null
          tips?: number | null
          total_revenue?: number | null
          trip_type_id?: string | null
          updated_at?: string | null
          user_id?: string
          week_end_date?: string | null
          week_label?: string
          week_number?: number | null
          week_start_date?: string | null
          week_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "revenues_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenues_trip_type_id_fkey"
            columns: ["trip_type_id"]
            isOneToOne: false
            referencedRelation: "trip_types"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          calculation_base: string | null
          created_at: string | null
          default_driver_percent: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calculation_base?: string | null
          created_at?: string | null
          default_driver_percent?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calculation_base?: string | null
          created_at?: string | null
          default_driver_percent?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          created_at: string | null
          driver_id: string
          end_date: string | null
          id: string
          pdf_exported: boolean | null
          pdf_url: string | null
          settlement_data: Json
          start_date: string | null
          updated_at: string | null
          user_id: string
          week_end_date: string
          week_number: number | null
          week_start_date: string
          week_year: number | null
          weeks: Json | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          end_date?: string | null
          id?: string
          pdf_exported?: boolean | null
          pdf_url?: string | null
          settlement_data: Json
          start_date?: string | null
          updated_at?: string | null
          user_id: string
          week_end_date: string
          week_number?: number | null
          week_start_date: string
          week_year?: number | null
          weeks?: Json | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          end_date?: string | null
          id?: string
          pdf_exported?: boolean | null
          pdf_url?: string | null
          settlement_data?: Json
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
          week_end_date?: string
          week_number?: number | null
          week_start_date?: string
          week_year?: number | null
          weeks?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
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
          appointment_time: string | null
          child_seats_count: number | null
          created_at: string | null
          destination_address: string | null
          driver_id: string | null
          flight_number: string | null
          has_companion: boolean | null
          has_stairs: boolean | null
          has_wheelchair: boolean | null
          id: string
          insurance_company: string | null
          is_paid: boolean
          notes: string | null
          passenger_email: string | null
          passenger_first_name: string | null
          passenger_last_name: string | null
          passenger_name: string | null
          passenger_phone: string | null
          passengers_count: number | null
          payment_type: string | null
          pickup_address: string | null
          pickup_date: string | null
          special_notes: string | null
          status: string
          transport_voucher_available: boolean | null
          trip_date: string
          trip_type_id: string | null
          updated_at: string | null
          user_id: string
          vat_rate: number | null
          vehicle_category_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          appointment_time?: string | null
          child_seats_count?: number | null
          created_at?: string | null
          destination_address?: string | null
          driver_id?: string | null
          flight_number?: string | null
          has_companion?: boolean | null
          has_stairs?: boolean | null
          has_wheelchair?: boolean | null
          id?: string
          insurance_company?: string | null
          is_paid?: boolean
          notes?: string | null
          passenger_email?: string | null
          passenger_first_name?: string | null
          passenger_last_name?: string | null
          passenger_name?: string | null
          passenger_phone?: string | null
          passengers_count?: number | null
          payment_type?: string | null
          pickup_address?: string | null
          pickup_date?: string | null
          special_notes?: string | null
          status?: string
          transport_voucher_available?: boolean | null
          trip_date: string
          trip_type_id?: string | null
          updated_at?: string | null
          user_id: string
          vat_rate?: number | null
          vehicle_category_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          appointment_time?: string | null
          child_seats_count?: number | null
          created_at?: string | null
          destination_address?: string | null
          driver_id?: string | null
          flight_number?: string | null
          has_companion?: boolean | null
          has_stairs?: boolean | null
          has_wheelchair?: boolean | null
          id?: string
          insurance_company?: string | null
          is_paid?: boolean
          notes?: string | null
          passenger_email?: string | null
          passenger_first_name?: string | null
          passenger_last_name?: string | null
          passenger_name?: string | null
          passenger_phone?: string | null
          passengers_count?: number | null
          payment_type?: string | null
          pickup_address?: string | null
          pickup_date?: string | null
          special_notes?: string | null
          status?: string
          transport_voucher_available?: boolean | null
          trip_date?: string
          trip_type_id?: string | null
          updated_at?: string | null
          user_id?: string
          vat_rate?: number | null
          vehicle_category_id?: string | null
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
            foreignKeyName: "trips_vehicle_category_id_fkey"
            columns: ["vehicle_category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
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
      vehicle_additional_costs: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          name: string
          period: string
          updated_at: string | null
          user_id: string
          vat_deductible: boolean | null
          vehicle_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
          name: string
          period: string
          updated_at?: string | null
          user_id: string
          vat_deductible?: boolean | null
          vehicle_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          name?: string
          period?: string
          updated_at?: string | null
          user_id?: string
          vat_deductible?: boolean | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_additional_costs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          trip_type_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          trip_type_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          trip_type_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_categories_trip_type_id_fkey"
            columns: ["trip_type_id"]
            isOneToOne: false
            referencedRelation: "trip_types"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_category_trip_types: {
        Row: {
          created_at: string | null
          id: string
          trip_type_id: string
          user_id: string
          vehicle_category_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          trip_type_id: string
          user_id: string
          vehicle_category_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          trip_type_id?: string
          user_id?: string
          vehicle_category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_category_trip_types_trip_type_id_fkey"
            columns: ["trip_type_id"]
            isOneToOne: false
            referencedRelation: "trip_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_category_trip_types_vehicle_category_id_fkey"
            columns: ["vehicle_category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_vehicle_categories: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          vehicle_category_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          vehicle_category_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          vehicle_category_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_vehicle_categories_vehicle_category_id_fkey"
            columns: ["vehicle_category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_vehicle_categories_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          consumption: number | null
          created_at: string | null
          fuel_price: number | null
          fuel_type: string | null
          id: string
          insurance: number | null
          insurance_cost: number | null
          leasing: number | null
          leasing_cost: number | null
          license_plate: string
          maintenance: number | null
          maintenance_cost: number | null
          make: string | null
          model: string | null
          name: string | null
          other_costs: number | null
          status: string | null
          tax: number | null
          tax_cost: number | null
          updated_at: string | null
          user_id: string
          vehicle_category_id: string | null
          year: number | null
        }
        Insert: {
          consumption?: number | null
          created_at?: string | null
          fuel_price?: number | null
          fuel_type?: string | null
          id?: string
          insurance?: number | null
          insurance_cost?: number | null
          leasing?: number | null
          leasing_cost?: number | null
          license_plate: string
          maintenance?: number | null
          maintenance_cost?: number | null
          make?: string | null
          model?: string | null
          name?: string | null
          other_costs?: number | null
          status?: string | null
          tax?: number | null
          tax_cost?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_category_id?: string | null
          year?: number | null
        }
        Update: {
          consumption?: number | null
          created_at?: string | null
          fuel_price?: number | null
          fuel_type?: string | null
          id?: string
          insurance?: number | null
          insurance_cost?: number | null
          leasing?: number | null
          leasing_cost?: number | null
          license_plate?: string
          maintenance?: number | null
          maintenance_cost?: number | null
          make?: string | null
          model?: string | null
          name?: string | null
          other_costs?: number | null
          status?: string | null
          tax?: number | null
          tax_cost?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_category_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_vehicle_category_id_fkey"
            columns: ["vehicle_category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
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
