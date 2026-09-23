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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_trail: {
        Row: {
          action: Database["public"]["Enums"]["audit_action_enum"]
          created_at: string
          details: string
          doctor_name: string
          id: string
          new_status: string | null
          patient_id: string | null
          patient_name: string
          previous_status: string | null
          timestamp: string
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action_enum"]
          created_at?: string
          details: string
          doctor_name: string
          id: string
          new_status?: string | null
          patient_id?: string | null
          patient_name: string
          previous_status?: string | null
          timestamp: string
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action_enum"]
          created_at?: string
          details?: string
          doctor_name?: string
          id?: string
          new_status?: string | null
          patient_id?: string | null
          patient_name?: string
          previous_status?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_trail_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name: string
        }
        Relationships: []
      }
      lesion_zones: {
        Row: {
          acetowhite_intensity: Database["public"]["Enums"]["acetowhite_intensity_enum"]
          biopsy_recommended: boolean
          confidence: number
          created_at: string
          height: number
          id: string
          margin_type: Database["public"]["Enums"]["margin_type_enum"]
          scan_id: string
          severity: Database["public"]["Enums"]["lesion_severity_enum"]
          vessels: Database["public"]["Enums"]["vessel_pattern_enum"]
          width: number
          x: number
          y: number
          zone_code: string
        }
        Insert: {
          acetowhite_intensity: Database["public"]["Enums"]["acetowhite_intensity_enum"]
          biopsy_recommended?: boolean
          confidence: number
          created_at?: string
          height: number
          id: string
          margin_type: Database["public"]["Enums"]["margin_type_enum"]
          scan_id: string
          severity: Database["public"]["Enums"]["lesion_severity_enum"]
          vessels: Database["public"]["Enums"]["vessel_pattern_enum"]
          width: number
          x: number
          y: number
          zone_code: string
        }
        Update: {
          acetowhite_intensity?: Database["public"]["Enums"]["acetowhite_intensity_enum"]
          biopsy_recommended?: boolean
          confidence?: number
          created_at?: string
          height?: number
          id?: string
          margin_type?: Database["public"]["Enums"]["margin_type_enum"]
          scan_id?: string
          severity?: Database["public"]["Enums"]["lesion_severity_enum"]
          vessels?: Database["public"]["Enums"]["vessel_pattern_enum"]
          width?: number
          x?: number
          y?: number
          zone_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesion_zones_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "screening_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      pap_smear_histories: {
        Row: {
          created_at: string
          cytotechnologist: string
          date: string
          facility: string
          id: string
          patient_id: string
          result: string
        }
        Insert: {
          created_at?: string
          cytotechnologist: string
          date: string
          facility: string
          id: string
          patient_id: string
          result: string
        }
        Update: {
          created_at?: string
          cytotechnologist?: string
          date?: string
          facility?: string
          id?: string
          patient_id?: string
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "pap_smear_histories_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number
          ai_confidence_score: number
          clinical_notes_summary: string | null
          created_at: string
          email: string | null
          ethnicity: string
          full_name: string
          gravida_para: string
          hospital_id: string
          hpv_dna_result: Database["public"]["Enums"]["hpv_result_enum"]
          ic_number: string
          id: string
          last_screening_date: string
          overall_risk: Database["public"]["Enums"]["risk_severity_enum"]
          phone: string | null
          status: Database["public"]["Enums"]["clinical_status_enum"]
          updated_at: string
        }
        Insert: {
          age: number
          ai_confidence_score?: number
          clinical_notes_summary?: string | null
          created_at?: string
          email?: string | null
          ethnicity: string
          full_name: string
          gravida_para: string
          hospital_id: string
          hpv_dna_result: Database["public"]["Enums"]["hpv_result_enum"]
          ic_number: string
          id: string
          last_screening_date: string
          overall_risk?: Database["public"]["Enums"]["risk_severity_enum"]
          phone?: string | null
          status?: Database["public"]["Enums"]["clinical_status_enum"]
          updated_at?: string
        }
        Update: {
          age?: number
          ai_confidence_score?: number
          clinical_notes_summary?: string | null
          created_at?: string
          email?: string | null
          ethnicity?: string
          full_name?: string
          gravida_para?: string
          hospital_id?: string
          hpv_dna_result?: Database["public"]["Enums"]["hpv_result_enum"]
          ic_number?: string
          id?: string
          last_screening_date?: string
          overall_risk?: Database["public"]["Enums"]["risk_severity_enum"]
          phone?: string | null
          status?: Database["public"]["Enums"]["clinical_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_scans: {
        Row: {
          acetic_acid_timing_seconds: number | null
          classification: string
          confidence_score: number
          created_at: string
          detected_lesion_count: number
          doctor_notes: string | null
          heatmap_overlay_url: string | null
          id: string
          lugols_iodine_staining:
            | Database["public"]["Enums"]["iodine_staining_enum"]
            | null
          original_image_url: string | null
          patient_id: string
          recommended_action: Database["public"]["Enums"]["recommended_action_enum"]
          scan_date: string
          swede_score: number
          transformation_zone_type: Database["public"]["Enums"]["tz_type_enum"]
          validated_at: string | null
          validated_by_doctor: string | null
          validation_status: Database["public"]["Enums"]["validation_decision_enum"]
        }
        Insert: {
          acetic_acid_timing_seconds?: number | null
          classification: string
          confidence_score: number
          created_at?: string
          detected_lesion_count?: number
          doctor_notes?: string | null
          heatmap_overlay_url?: string | null
          id: string
          lugols_iodine_staining?:
            | Database["public"]["Enums"]["iodine_staining_enum"]
            | null
          original_image_url?: string | null
          patient_id: string
          recommended_action: Database["public"]["Enums"]["recommended_action_enum"]
          scan_date: string
          swede_score?: number
          transformation_zone_type: Database["public"]["Enums"]["tz_type_enum"]
          validated_at?: string | null
          validated_by_doctor?: string | null
          validation_status?: Database["public"]["Enums"]["validation_decision_enum"]
        }
        Update: {
          acetic_acid_timing_seconds?: number | null
          classification?: string
          confidence_score?: number
          created_at?: string
          detected_lesion_count?: number
          doctor_notes?: string | null
          heatmap_overlay_url?: string | null
          id?: string
          lugols_iodine_staining?:
            | Database["public"]["Enums"]["iodine_staining_enum"]
            | null
          original_image_url?: string | null
          patient_id?: string
          recommended_action?: Database["public"]["Enums"]["recommended_action_enum"]
          scan_date?: string
          swede_score?: number
          transformation_zone_type?: Database["public"]["Enums"]["tz_type_enum"]
          validated_at?: string | null
          validated_by_doctor?: string | null
          validation_status?: Database["public"]["Enums"]["validation_decision_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "screening_scans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      acetowhite_intensity_enum:
        | "Dense / Opaque"
        | "Faint / Translucent"
        | "None"
      audit_action_enum:
        | "VALIDATION_CONFIRMED"
        | "DIAGNOSIS_OVERRIDDEN"
        | "BIOPSY_ORDERED"
        | "REPORT_EXPORTED"
        | "PRIVACY_MODE_TOGGLED"
      clinical_status_enum:
        | "Reviewed"
        | "Pending Validation"
        | "Requires Biopsy"
      hpv_result_enum:
        | "HPV 16+"
        | "HPV 18+"
        | "HPV 16/18 High Risk"
        | "Other High Risk HPV"
        | "Negative"
        | "Sample Inconclusive"
      iodine_staining_enum:
        | "Iodine Negative"
        | "Partial Uptake"
        | "Uniform Dark Brown"
      lesion_severity_enum: "HSIL / CIN2+" | "LSIL / CIN1" | "Atypical Squamous"
      margin_type_enum: "Sharp / Peeling" | "Feathered / Diffuse" | "Smooth"
      recommended_action_enum:
        | "Direct Punch Biopsy"
        | "LEEP / LLETZ"
        | "Repeat Screening in 6 Months"
        | "Routine 3-Year Recall"
      risk_severity_enum: "HIGH_RISK" | "MODERATE_RISK" | "LOW_RISK" | "PENDING"
      tz_type_enum: "Type 1" | "Type 2" | "Type 3"
      validation_decision_enum:
        | "CONFIRMED"
        | "OVERRIDDEN"
        | "REJECTED"
        | "PENDING"
      vessel_pattern_enum:
        | "Coarse Punctation"
        | "Fine Mosaic"
        | "Normal / Absent"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      acetowhite_intensity_enum: [
        "Dense / Opaque",
        "Faint / Translucent",
        "None",
      ],
      audit_action_enum: [
        "VALIDATION_CONFIRMED",
        "DIAGNOSIS_OVERRIDDEN",
        "BIOPSY_ORDERED",
        "REPORT_EXPORTED",
        "PRIVACY_MODE_TOGGLED",
      ],
      clinical_status_enum: [
        "Reviewed",
        "Pending Validation",
        "Requires Biopsy",
      ],
      hpv_result_enum: [
        "HPV 16+",
        "HPV 18+",
        "HPV 16/18 High Risk",
        "Other High Risk HPV",
        "Negative",
        "Sample Inconclusive",
      ],
      iodine_staining_enum: [
        "Iodine Negative",
        "Partial Uptake",
        "Uniform Dark Brown",
      ],
      lesion_severity_enum: [
        "HSIL / CIN2+",
        "LSIL / CIN1",
        "Atypical Squamous",
      ],
      margin_type_enum: ["Sharp / Peeling", "Feathered / Diffuse", "Smooth"],
      recommended_action_enum: [
        "Direct Punch Biopsy",
        "LEEP / LLETZ",
        "Repeat Screening in 6 Months",
        "Routine 3-Year Recall",
      ],
      risk_severity_enum: ["HIGH_RISK", "MODERATE_RISK", "LOW_RISK", "PENDING"],
      tz_type_enum: ["Type 1", "Type 2", "Type 3"],
      validation_decision_enum: [
        "CONFIRMED",
        "OVERRIDDEN",
        "REJECTED",
        "PENDING",
      ],
      vessel_pattern_enum: [
        "Coarse Punctation",
        "Fine Mosaic",
        "Normal / Absent",
      ],
    },
  },
} as const
