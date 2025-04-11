export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  estimate_agent: {
    Tables: {
      business_analyses: {
        Row: {
          company_size: number | null;
          cost_optimization: Json | null;
          created_at: string;
          current_process_hours: number | null;
          efficiency_prediction: Json | null;
          estimate_id: string | null;
          id: string;
          industry: string | null;
          roi_analysis: Json | null;
          scalability_analysis: Json | null;
          session_id: string | null;
          temporary_estimate_id: string | null;
          updated_at: string;
        };
        Insert: {
          company_size?: number | null;
          cost_optimization?: Json | null;
          created_at?: string;
          current_process_hours?: number | null;
          efficiency_prediction?: Json | null;
          estimate_id?: string | null;
          id?: string;
          industry?: string | null;
          roi_analysis?: Json | null;
          scalability_analysis?: Json | null;
          session_id?: string | null;
          temporary_estimate_id?: string | null;
          updated_at?: string;
        };
        Update: {
          company_size?: number | null;
          cost_optimization?: Json | null;
          created_at?: string;
          current_process_hours?: number | null;
          efficiency_prediction?: Json | null;
          estimate_id?: string | null;
          id?: string;
          industry?: string | null;
          roi_analysis?: Json | null;
          scalability_analysis?: Json | null;
          session_id?: string | null;
          temporary_estimate_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_analyses_estimate_id_fkey';
            columns: ['estimate_id'];
            isOneToOne: false;
            referencedRelation: 'estimates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_analyses_temporary_estimate_id_fkey';
            columns: ['temporary_estimate_id'];
            isOneToOne: false;
            referencedRelation: 'temporary_estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      business_analysis_reports: {
        Row: {
          business_analysis_id: string;
          created_at: string;
          id: string;
          report_type: string;
          report_url: string;
          session_id: string | null;
        };
        Insert: {
          business_analysis_id: string;
          created_at?: string;
          id?: string;
          report_type: string;
          report_url: string;
          session_id?: string | null;
        };
        Update: {
          business_analysis_id?: string;
          created_at?: string;
          id?: string;
          report_type?: string;
          report_url?: string;
          session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_analysis_reports_business_analysis_id_fkey';
            columns: ['business_analysis_id'];
            isOneToOne: false;
            referencedRelation: 'business_analyses';
            referencedColumns: ['id'];
          },
        ];
      };
      clients: {
        Row: {
          company: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      email_notifications: {
        Row: {
          content: Json | null;
          created_at: string;
          email: string;
          estimate_id: string | null;
          id: string;
          sent_at: string | null;
          status: string;
          temporary_estimate_id: string | null;
          updated_at: string;
        };
        Insert: {
          content?: Json | null;
          created_at?: string;
          email: string;
          estimate_id?: string | null;
          id?: string;
          sent_at?: string | null;
          status?: string;
          temporary_estimate_id?: string | null;
          updated_at?: string;
        };
        Update: {
          content?: Json | null;
          created_at?: string;
          email?: string;
          estimate_id?: string | null;
          id?: string;
          sent_at?: string | null;
          status?: string;
          temporary_estimate_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'email_notifications_estimate_id_fkey';
            columns: ['estimate_id'];
            isOneToOne: false;
            referencedRelation: 'estimates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'email_notifications_temporary_estimate_id_fkey';
            columns: ['temporary_estimate_id'];
            isOneToOne: false;
            referencedRelation: 'temporary_estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      estimate_items: {
        Row: {
          complexity: string | null;
          created_at: string;
          description: string | null;
          estimate_id: string;
          estimated_hours: number | null;
          id: string;
          is_required: boolean | null;
          is_selected: boolean | null;
          name: string;
          position: number;
          quantity: number;
          unit_price: number;
          updated_at: string;
        };
        Insert: {
          complexity?: string | null;
          created_at?: string;
          description?: string | null;
          estimate_id: string;
          estimated_hours?: number | null;
          id?: string;
          is_required?: boolean | null;
          is_selected?: boolean | null;
          name: string;
          position?: number;
          quantity?: number;
          unit_price: number;
          updated_at?: string;
        };
        Update: {
          complexity?: string | null;
          created_at?: string;
          description?: string | null;
          estimate_id?: string;
          estimated_hours?: number | null;
          id?: string;
          is_required?: boolean | null;
          is_selected?: boolean | null;
          name?: string;
          position?: number;
          quantity?: number;
          unit_price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'estimate_items_estimate_id_fkey';
            columns: ['estimate_id'];
            isOneToOne: false;
            referencedRelation: 'estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      estimate_questions: {
        Row: {
          answer: string | null;
          category: string | null;
          created_at: string;
          estimate_id: string;
          id: string;
          is_answered: boolean | null;
          position: number;
          question: string;
          template_id: string | null;
          updated_at: string;
        };
        Insert: {
          answer?: string | null;
          category?: string | null;
          created_at?: string;
          estimate_id: string;
          id?: string;
          is_answered?: boolean | null;
          position?: number;
          question: string;
          template_id?: string | null;
          updated_at?: string;
        };
        Update: {
          answer?: string | null;
          category?: string | null;
          created_at?: string;
          estimate_id?: string;
          id?: string;
          is_answered?: boolean | null;
          position?: number;
          question?: string;
          template_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'estimate_questions_estimate_id_fkey';
            columns: ['estimate_id'];
            isOneToOne: false;
            referencedRelation: 'estimates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'estimate_questions_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'question_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      estimates: {
        Row: {
          client_id: string | null;
          created_at: string;
          description: string | null;
          expiry_date: string | null;
          id: string;
          initial_requirements: string;
          metadata: Json | null;
          pdf_url: string | null;
          session_id: string | null;
          status: string;
          title: string;
          total_amount: number | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          expiry_date?: string | null;
          id?: string;
          initial_requirements: string;
          metadata?: Json | null;
          pdf_url?: string | null;
          session_id?: string | null;
          status?: string;
          title: string;
          total_amount?: number | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          expiry_date?: string | null;
          id?: string;
          initial_requirements?: string;
          metadata?: Json | null;
          pdf_url?: string | null;
          session_id?: string | null;
          status?: string;
          title?: string;
          total_amount?: number | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'estimates_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
        ];
      };
      industry_benchmarks: {
        Row: {
          average_roi: number;
          average_savings_rate: number;
          created_at: string;
          data_source: string | null;
          efficiency_metrics: Json | null;
          id: string;
          industry: string;
          updated_at: string;
        };
        Insert: {
          average_roi: number;
          average_savings_rate: number;
          created_at?: string;
          data_source?: string | null;
          efficiency_metrics?: Json | null;
          id?: string;
          industry: string;
          updated_at?: string;
        };
        Update: {
          average_roi?: number;
          average_savings_rate?: number;
          created_at?: string;
          data_source?: string | null;
          efficiency_metrics?: Json | null;
          id?: string;
          industry?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_templates: {
        Row: {
          actual_cost: number | null;
          actual_hours: number | null;
          category: string;
          content_embedding: number[] | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          actual_cost?: number | null;
          actual_hours?: number | null;
          category: string;
          content_embedding?: number[] | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          actual_cost?: number | null;
          actual_hours?: number | null;
          category?: string;
          content_embedding?: number[] | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      question_templates: {
        Row: {
          category: string;
          conditions: Json | null;
          created_at: string;
          description: string | null;
          id: string;
          is_required: boolean | null;
          position: number;
          question: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          conditions?: Json | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_required?: boolean | null;
          position?: number;
          question: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          conditions?: Json | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_required?: boolean | null;
          position?: number;
          question?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_categories: {
        Row: {
          created_at: string;
          default_questions: Json | null;
          description: string | null;
          id: string;
          keywords: Json | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          default_questions?: Json | null;
          description?: string | null;
          id?: string;
          keywords?: Json | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          default_questions?: Json | null;
          description?: string | null;
          id?: string;
          keywords?: Json | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      template_features: {
        Row: {
          complexity: string | null;
          created_at: string;
          description: string | null;
          description_embedding: number[] | null;
          estimated_hours: number | null;
          id: string;
          name: string;
          project_template_id: string;
          unit_price: number | null;
          updated_at: string;
        };
        Insert: {
          complexity?: string | null;
          created_at?: string;
          description?: string | null;
          description_embedding?: number[] | null;
          estimated_hours?: number | null;
          id?: string;
          name: string;
          project_template_id: string;
          unit_price?: number | null;
          updated_at?: string;
        };
        Update: {
          complexity?: string | null;
          created_at?: string;
          description?: string | null;
          description_embedding?: number[] | null;
          estimated_hours?: number | null;
          id?: string;
          name?: string;
          project_template_id?: string;
          unit_price?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'template_features_project_template_id_fkey';
            columns: ['project_template_id'];
            isOneToOne: false;
            referencedRelation: 'project_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      temporary_estimate_items: {
        Row: {
          complexity: string | null;
          created_at: string;
          description: string | null;
          estimated_hours: number | null;
          id: string;
          is_required: boolean | null;
          is_selected: boolean | null;
          name: string;
          position: number;
          quantity: number;
          temporary_estimate_id: string;
          unit_price: number;
          updated_at: string;
        };
        Insert: {
          complexity?: string | null;
          created_at?: string;
          description?: string | null;
          estimated_hours?: number | null;
          id?: string;
          is_required?: boolean | null;
          is_selected?: boolean | null;
          name: string;
          position?: number;
          quantity?: number;
          temporary_estimate_id: string;
          unit_price: number;
          updated_at?: string;
        };
        Update: {
          complexity?: string | null;
          created_at?: string;
          description?: string | null;
          estimated_hours?: number | null;
          id?: string;
          is_required?: boolean | null;
          is_selected?: boolean | null;
          name?: string;
          position?: number;
          quantity?: number;
          temporary_estimate_id?: string;
          unit_price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'temporary_estimate_items_temporary_estimate_id_fkey';
            columns: ['temporary_estimate_id'];
            isOneToOne: false;
            referencedRelation: 'temporary_estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      temporary_estimate_questions: {
        Row: {
          answer: string | null;
          category: string | null;
          created_at: string;
          id: string;
          is_answered: boolean | null;
          position: number;
          question: string;
          template_id: string | null;
          temporary_estimate_id: string;
          updated_at: string;
        };
        Insert: {
          answer?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_answered?: boolean | null;
          position?: number;
          question: string;
          template_id?: string | null;
          temporary_estimate_id: string;
          updated_at?: string;
        };
        Update: {
          answer?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_answered?: boolean | null;
          position?: number;
          question?: string;
          template_id?: string | null;
          temporary_estimate_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'temporary_estimate_questions_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'question_templates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'temporary_estimate_questions_temporary_estimate_id_fkey';
            columns: ['temporary_estimate_id'];
            isOneToOne: false;
            referencedRelation: 'temporary_estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      temporary_estimates: {
        Row: {
          created_at: string;
          description: string | null;
          email: string | null;
          expires_at: string;
          id: string;
          initial_requirements: string;
          metadata: Json | null;
          pdf_url: string | null;
          session_id: string;
          status: string;
          title: string;
          total_amount: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          email?: string | null;
          expires_at?: string;
          id?: string;
          initial_requirements: string;
          metadata?: Json | null;
          pdf_url?: string | null;
          session_id: string;
          status?: string;
          title?: string;
          total_amount?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          email?: string | null;
          expires_at?: string;
          id?: string;
          initial_requirements?: string;
          metadata?: Json | null;
          pdf_url?: string | null;
          session_id?: string;
          status?: string;
          title?: string;
          total_amount?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_similarity_between_vectors: {
        Args: { vec1: string; vec2: string };
        Returns: number;
      };
      cleanup_expired_temporary_estimates: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      function_exists: {
        Args: { function_name: string };
        Returns: boolean;
      };
      match_project_templates: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          description: string;
          actual_hours: number;
          actual_cost: number;
          created_at: string;
          updated_at: string;
          content_embedding: string;
          similarity: number;
        }[];
      };
      migrate_temporary_estimate_to_permanent: {
        Args: { p_temp_estimate_id: string; p_user_id: string };
        Returns: string;
      };
      process_pending_email_notifications: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      search_similar_templates_v2: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          description: string;
          actual_hours: number;
          actual_cost: number;
          created_at: string;
          updated_at: string;
          content_embedding: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string;
          admin_user_id: string;
          details: Json | null;
          id: string;
          performed_at: string;
          target_id: string | null;
          target_type: string | null;
        };
        Insert: {
          action: string;
          admin_user_id: string;
          details?: Json | null;
          id?: string;
          performed_at?: string;
          target_id?: string | null;
          target_type?: string | null;
        };
        Update: {
          action?: string;
          admin_user_id?: string;
          details?: Json | null;
          id?: string;
          performed_at?: string;
          target_id?: string | null;
          target_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_audit_logs_admin_user_id_fkey';
            columns: ['admin_user_id'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          },
        ];
      };
      admin_users: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      admin_users_history: {
        Row: {
          action: string;
          admin_user_id: string;
          id: string;
          metadata: Json | null;
          performed_at: string;
          performed_by: string;
          user_id: string;
        };
        Insert: {
          action: string;
          admin_user_id: string;
          id?: string;
          metadata?: Json | null;
          performed_at?: string;
          performed_by: string;
          user_id: string;
        };
        Update: {
          action?: string;
          admin_user_id?: string;
          id?: string;
          metadata?: Json | null;
          performed_at?: string;
          performed_by?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_users_history_admin_user_id_fkey';
            columns: ['admin_user_id'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          error_message: string | null;
          id: string;
          ip_address: unknown | null;
          new_values: Json | null;
          old_values: Json | null;
          status: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          error_message?: string | null;
          id?: string;
          ip_address?: unknown | null;
          new_values?: Json | null;
          old_values?: Json | null;
          status?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          error_message?: string | null;
          id?: string;
          ip_address?: unknown | null;
          new_values?: Json | null;
          old_values?: Json | null;
          status?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          content: string;
          created_at: string | null;
          description: string;
          estimated_reading_time: number;
          id: string;
          published_at: string | null;
          slug: string;
          status: string;
          thumbnail_url: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          description: string;
          estimated_reading_time: number;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: string;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          description?: string;
          estimated_reading_time?: number;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: string;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      blog_posts_categories: {
        Row: {
          category_id: string;
          post_id: string;
        };
        Insert: {
          category_id: string;
          post_id: string;
        };
        Update: {
          category_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_posts_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'blog_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_posts_categories_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'blog_posts';
            referencedColumns: ['id'];
          },
        ];
      };
      client_comments: {
        Row: {
          comment_text: string;
          created_at: string | null;
          id: string;
          parent_comment_id: string | null;
          project_id: string;
          target_id: string | null;
          target_type: string | null;
          user_id: string | null;
        };
        Insert: {
          comment_text: string;
          created_at?: string | null;
          id?: string;
          parent_comment_id?: string | null;
          project_id: string;
          target_id?: string | null;
          target_type?: string | null;
          user_id?: string | null;
        };
        Update: {
          comment_text?: string;
          created_at?: string | null;
          id?: string;
          parent_comment_id?: string | null;
          project_id?: string;
          target_id?: string | null;
          target_type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'client_comments_parent_comment_id_fkey';
            columns: ['parent_comment_id'];
            isOneToOne: false;
            referencedRelation: 'client_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'client_comments_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      contact_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      contact_chat_messages: {
        Row: {
          chat_id: string;
          faq_id: string | null;
          id: string;
          is_escalation_request: boolean;
          message_text: string;
          sender_type: string;
          timestamp: string | null;
        };
        Insert: {
          chat_id: string;
          faq_id?: string | null;
          id?: string;
          is_escalation_request?: boolean;
          message_text: string;
          sender_type: string;
          timestamp?: string | null;
        };
        Update: {
          chat_id?: string;
          faq_id?: string | null;
          id?: string;
          is_escalation_request?: boolean;
          message_text?: string;
          sender_type?: string;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'contact_chats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_messages_faq_id_fkey';
            columns: ['faq_id'];
            isOneToOne: false;
            referencedRelation: 'faqs';
            referencedColumns: ['id'];
          },
        ];
      };
      contact_chats: {
        Row: {
          category_id: string;
          created_at: string | null;
          id: string;
          page_url: string | null;
          profile_id: string;
          status: string;
        };
        Insert: {
          category_id: string;
          created_at?: string | null;
          id?: string;
          page_url?: string | null;
          profile_id: string;
          status?: string;
        };
        Update: {
          category_id?: string;
          created_at?: string | null;
          id?: string;
          page_url?: string | null;
          profile_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chats_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'contact_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chats_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      email_attachments: {
        Row: {
          attachment_id: string | null;
          created_at: string | null;
          downloaded_at: string | null;
          email_id: string | null;
          file_name: string;
          file_path: string | null;
          file_size: number;
          file_type: string;
          id: string;
          is_downloaded: boolean | null;
        };
        Insert: {
          attachment_id?: string | null;
          created_at?: string | null;
          downloaded_at?: string | null;
          email_id?: string | null;
          file_name: string;
          file_path?: string | null;
          file_size: number;
          file_type: string;
          id?: string;
          is_downloaded?: boolean | null;
        };
        Update: {
          attachment_id?: string | null;
          created_at?: string | null;
          downloaded_at?: string | null;
          email_id?: string | null;
          file_name?: string;
          file_path?: string | null;
          file_size?: number;
          file_type?: string;
          id?: string;
          is_downloaded?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_attachments_email_id_fkey';
            columns: ['email_id'];
            isOneToOne: false;
            referencedRelation: 'emails';
            referencedColumns: ['id'];
          },
        ];
      };
      email_replies: {
        Row: {
          bcc_email: string[] | null;
          body_html: string | null;
          body_text: string | null;
          cc_email: string[] | null;
          created_at: string | null;
          from_email: string;
          gmail_message_id: string;
          id: string;
          original_email_id: string | null;
          sent_at: string;
          subject: string;
          to_email: string[];
        };
        Insert: {
          bcc_email?: string[] | null;
          body_html?: string | null;
          body_text?: string | null;
          cc_email?: string[] | null;
          created_at?: string | null;
          from_email: string;
          gmail_message_id: string;
          id?: string;
          original_email_id?: string | null;
          sent_at: string;
          subject: string;
          to_email: string[];
        };
        Update: {
          bcc_email?: string[] | null;
          body_html?: string | null;
          body_text?: string | null;
          cc_email?: string[] | null;
          created_at?: string | null;
          from_email?: string;
          gmail_message_id?: string;
          id?: string;
          original_email_id?: string | null;
          sent_at?: string;
          subject?: string;
          to_email?: string[];
        };
        Relationships: [
          {
            foreignKeyName: 'email_replies_original_email_id_fkey';
            columns: ['original_email_id'];
            isOneToOne: false;
            referencedRelation: 'emails';
            referencedColumns: ['id'];
          },
        ];
      };
      email_settings: {
        Row: {
          auto_archive_after_days: number | null;
          created_at: string | null;
          id: string;
          last_sync_at: string | null;
          notification_enabled: boolean | null;
          signature: string | null;
          updated_at: string | null;
        };
        Insert: {
          auto_archive_after_days?: number | null;
          created_at?: string | null;
          id?: string;
          last_sync_at?: string | null;
          notification_enabled?: boolean | null;
          signature?: string | null;
          updated_at?: string | null;
        };
        Update: {
          auto_archive_after_days?: number | null;
          created_at?: string | null;
          id?: string;
          last_sync_at?: string | null;
          notification_enabled?: boolean | null;
          signature?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      emails: {
        Row: {
          bcc_email: string[] | null;
          body_html: string | null;
          body_text: string | null;
          cc_email: string[] | null;
          created_at: string | null;
          from_email: string;
          from_name: string | null;
          gmail_message_id: string;
          has_attachments: boolean | null;
          id: string;
          is_archived: boolean | null;
          is_read: boolean | null;
          is_starred: boolean | null;
          labels: string[] | null;
          received_at: string;
          subject: string;
          thread_id: string;
          to_email: string[];
          updated_at: string | null;
        };
        Insert: {
          bcc_email?: string[] | null;
          body_html?: string | null;
          body_text?: string | null;
          cc_email?: string[] | null;
          created_at?: string | null;
          from_email: string;
          from_name?: string | null;
          gmail_message_id: string;
          has_attachments?: boolean | null;
          id?: string;
          is_archived?: boolean | null;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          labels?: string[] | null;
          received_at: string;
          subject: string;
          thread_id: string;
          to_email: string[];
          updated_at?: string | null;
        };
        Update: {
          bcc_email?: string[] | null;
          body_html?: string | null;
          body_text?: string | null;
          cc_email?: string[] | null;
          created_at?: string | null;
          from_email?: string;
          from_name?: string | null;
          gmail_message_id?: string;
          has_attachments?: boolean | null;
          id?: string;
          is_archived?: boolean | null;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          labels?: string[] | null;
          received_at?: string;
          subject?: string;
          thread_id?: string;
          to_email?: string[];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      estimate_features: {
        Row: {
          category: string;
          created_at: string | null;
          description: string;
          duration: number;
          estimate_id: string | null;
          id: string;
          is_required: boolean;
          name: string;
          price: number;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description: string;
          duration: number;
          estimate_id?: string | null;
          id?: string;
          is_required?: boolean;
          name: string;
          price: number;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string;
          duration?: number;
          estimate_id?: string | null;
          id?: string;
          is_required?: boolean;
          name?: string;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'estimate_features_estimate_id_fkey';
            columns: ['estimate_id'];
            isOneToOne: false;
            referencedRelation: 'estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      estimate_requirements: {
        Row: {
          created_at: string | null;
          design_format: string | null;
          estimate_id: string | null;
          has_brand_guidelines: boolean;
          has_content: boolean;
          has_custom_fonts: boolean;
          has_design: boolean;
          has_icons: boolean;
          has_images: boolean;
          has_logo: boolean;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          design_format?: string | null;
          estimate_id?: string | null;
          has_brand_guidelines?: boolean;
          has_content?: boolean;
          has_custom_fonts?: boolean;
          has_design?: boolean;
          has_icons?: boolean;
          has_images?: boolean;
          has_logo?: boolean;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          design_format?: string | null;
          estimate_id?: string | null;
          has_brand_guidelines?: boolean;
          has_content?: boolean;
          has_custom_fonts?: boolean;
          has_design?: boolean;
          has_icons?: boolean;
          has_images?: boolean;
          has_logo?: boolean;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'estimate_requirements_estimate_id_fkey';
            columns: ['estimate_id'];
            isOneToOne: false;
            referencedRelation: 'estimates';
            referencedColumns: ['id'];
          },
        ];
      };
      estimates: {
        Row: {
          base_cost: number;
          contact_id: string | null;
          created_at: string | null;
          deadline: string;
          description: string;
          id: string;
          project_type: string;
          rush_fee: number;
          status: string;
          total_cost: number;
          updated_at: string | null;
        };
        Insert: {
          base_cost: number;
          contact_id?: string | null;
          created_at?: string | null;
          deadline: string;
          description: string;
          id?: string;
          project_type: string;
          rush_fee?: number;
          status?: string;
          total_cost: number;
          updated_at?: string | null;
        };
        Update: {
          base_cost?: number;
          contact_id?: string | null;
          created_at?: string | null;
          deadline?: string;
          description?: string;
          id?: string;
          project_type?: string;
          rush_fee?: number;
          status?: string;
          total_cost?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          category_id: string;
          created_at: string | null;
          id: string;
          question: string;
        };
        Insert: {
          answer: string;
          category_id: string;
          created_at?: string | null;
          id?: string;
          question: string;
        };
        Update: {
          answer?: string;
          category_id?: string;
          created_at?: string | null;
          id?: string;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'faqs_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'contact_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      files: {
        Row: {
          created_at: string | null;
          file_name: string;
          file_size: number;
          file_url: string;
          id: string;
          message_id: string;
          mime_type: string;
        };
        Insert: {
          created_at?: string | null;
          file_name: string;
          file_size: number;
          file_url: string;
          id?: string;
          message_id: string;
          mime_type: string;
        };
        Update: {
          created_at?: string | null;
          file_name?: string;
          file_size?: number;
          file_url?: string;
          id?: string;
          message_id?: string;
          mime_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'files_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'contact_chat_messages';
            referencedColumns: ['id'];
          },
        ];
      };
      focus_intervals: {
        Row: {
          created_at: string | null;
          ended_at: string | null;
          id: string;
          interval_type: string;
          session_id: string;
          started_at: string;
        };
        Insert: {
          created_at?: string | null;
          ended_at?: string | null;
          id?: string;
          interval_type: string;
          session_id: string;
          started_at: string;
        };
        Update: {
          created_at?: string | null;
          ended_at?: string | null;
          id?: string;
          interval_type?: string;
          session_id?: string;
          started_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'focus_intervals_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'focus_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      focus_sessions: {
        Row: {
          created_at: string | null;
          ended_at: string | null;
          focus_score: number | null;
          id: string;
          knowledge_page_id: string | null;
          project_id: string | null;
          started_at: string;
          status: string;
          task_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          ended_at?: string | null;
          focus_score?: number | null;
          id?: string;
          knowledge_page_id?: string | null;
          project_id?: string | null;
          started_at: string;
          status: string;
          task_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          ended_at?: string | null;
          focus_score?: number | null;
          id?: string;
          knowledge_page_id?: string | null;
          project_id?: string | null;
          started_at?: string;
          status?: string;
          task_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'focus_sessions_knowledge_page_id_fkey';
            columns: ['knowledge_page_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_pages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'focus_sessions_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'focus_sessions_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      github_contributions: {
        Row: {
          commit_count: number;
          contribution_count: number;
          contribution_date: string;
          created_at: string;
          id: string;
          lines_added: number;
          lines_deleted: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          commit_count?: number;
          contribution_count?: number;
          contribution_date: string;
          created_at?: string;
          id?: string;
          lines_added?: number;
          lines_deleted?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          commit_count?: number;
          contribution_count?: number;
          contribution_date?: string;
          created_at?: string;
          id?: string;
          lines_added?: number;
          lines_deleted?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      github_labels: {
        Row: {
          color: string | null;
          description: string | null;
          github_label_id: number;
          name: string;
          repository_id: number;
          synced_at: string | null;
        };
        Insert: {
          color?: string | null;
          description?: string | null;
          github_label_id: number;
          name: string;
          repository_id: number;
          synced_at?: string | null;
        };
        Update: {
          color?: string | null;
          description?: string | null;
          github_label_id?: number;
          name?: string;
          repository_id?: number;
          synced_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'github_labels_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'github_repositories';
            referencedColumns: ['id'];
          },
        ];
      };
      github_repositories: {
        Row: {
          description: string | null;
          html_url: string | null;
          id: number;
          is_private: boolean;
          name: string;
          owner: string;
          synced_at: string | null;
        };
        Insert: {
          description?: string | null;
          html_url?: string | null;
          id: number;
          is_private?: boolean;
          name: string;
          owner: string;
          synced_at?: string | null;
        };
        Update: {
          description?: string | null;
          html_url?: string | null;
          id?: number;
          is_private?: boolean;
          name?: string;
          owner?: string;
          synced_at?: string | null;
        };
        Relationships: [];
      };
      github_settings: {
        Row: {
          access_token: string;
          auto_sync: boolean | null;
          created_at: string | null;
          id: string;
          last_synced_at: string | null;
          repository: string;
          updated_at: string | null;
          user_id: string | null;
          username: string;
        };
        Insert: {
          access_token: string;
          auto_sync?: boolean | null;
          created_at?: string | null;
          id?: string;
          last_synced_at?: string | null;
          repository?: string;
          updated_at?: string | null;
          user_id?: string | null;
          username: string;
        };
        Update: {
          access_token?: string;
          auto_sync?: boolean | null;
          created_at?: string | null;
          id?: string;
          last_synced_at?: string | null;
          repository?: string;
          updated_at?: string | null;
          user_id?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      github_users: {
        Row: {
          avatar_url: string | null;
          html_url: string | null;
          id: number;
          login: string;
          synced_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          html_url?: string | null;
          id: number;
          login: string;
          synced_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          html_url?: string | null;
          id?: number;
          login?: string;
          synced_at?: string | null;
        };
        Relationships: [];
      };
      gmail_credentials: {
        Row: {
          access_token: string;
          created_at: string | null;
          expiry_date: string;
          id: string;
          refresh_token: string;
          token_type: string;
          updated_at: string | null;
        };
        Insert: {
          access_token: string;
          created_at?: string | null;
          expiry_date: string;
          id?: string;
          refresh_token: string;
          token_type: string;
          updated_at?: string | null;
        };
        Update: {
          access_token?: string;
          created_at?: string | null;
          expiry_date?: string;
          id?: string;
          refresh_token?: string;
          token_type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      knowledge_page_collaborators: {
        Row: {
          created_at: string;
          id: string;
          is_last_editor: boolean;
          page_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_last_editor?: boolean;
          page_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_last_editor?: boolean;
          page_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_page_collaborators_page_id_fkey';
            columns: ['page_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_pages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_page_collaborators_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_users';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_page_details: {
        Row: {
          created_at: string;
          files: string[];
          icons: string[];
          id: string;
          lines: Json;
          page_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          files?: string[];
          icons?: string[];
          id?: string;
          lines?: Json;
          page_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          files?: string[];
          icons?: string[];
          id?: string;
          lines?: Json;
          page_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_page_details_page_id_fkey';
            columns: ['page_id'];
            isOneToOne: true;
            referencedRelation: 'knowledge_pages';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_page_links: {
        Row: {
          created_at: string;
          hop_level: number;
          id: string;
          source_page_id: string;
          target_page_id: string;
        };
        Insert: {
          created_at?: string;
          hop_level?: number;
          id?: string;
          source_page_id: string;
          target_page_id: string;
        };
        Update: {
          created_at?: string;
          hop_level?: number;
          id?: string;
          source_page_id?: string;
          target_page_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_page_links_source_page_id_fkey';
            columns: ['source_page_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_pages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_page_links_target_page_id_fkey';
            columns: ['target_page_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_pages';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_pages: {
        Row: {
          accessed_at: string | null;
          commit_id: string | null;
          created_at: string;
          descriptions: string[];
          id: string;
          image_url: string | null;
          last_accessed_at: string | null;
          linked_count: number;
          page_rank: number;
          persistent: boolean;
          pin_status: number;
          project_id: string;
          scrapbox_id: string;
          snapshot_count: number;
          snapshot_created_at: string | null;
          title: string;
          updated_at: string;
          views: number;
        };
        Insert: {
          accessed_at?: string | null;
          commit_id?: string | null;
          created_at: string;
          descriptions?: string[];
          id?: string;
          image_url?: string | null;
          last_accessed_at?: string | null;
          linked_count?: number;
          page_rank?: number;
          persistent?: boolean;
          pin_status?: number;
          project_id: string;
          scrapbox_id: string;
          snapshot_count?: number;
          snapshot_created_at?: string | null;
          title: string;
          updated_at: string;
          views?: number;
        };
        Update: {
          accessed_at?: string | null;
          commit_id?: string | null;
          created_at?: string;
          descriptions?: string[];
          id?: string;
          image_url?: string | null;
          last_accessed_at?: string | null;
          linked_count?: number;
          page_rank?: number;
          persistent?: boolean;
          pin_status?: number;
          project_id?: string;
          scrapbox_id?: string;
          snapshot_count?: number;
          snapshot_created_at?: string | null;
          title?: string;
          updated_at?: string;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_pages_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_projects';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_projects: {
        Row: {
          auto_sync_enabled: boolean;
          created_at: string;
          id: string;
          is_private: boolean;
          last_synced_at: string;
          project_name: string;
          scrapbox_cookie: string | null;
          total_pages: number;
          updated_at: string;
        };
        Insert: {
          auto_sync_enabled?: boolean;
          created_at?: string;
          id?: string;
          is_private?: boolean;
          last_synced_at: string;
          project_name: string;
          scrapbox_cookie?: string | null;
          total_pages?: number;
          updated_at?: string;
        };
        Update: {
          auto_sync_enabled?: boolean;
          created_at?: string;
          id?: string;
          is_private?: boolean;
          last_synced_at?: string;
          project_name?: string;
          scrapbox_cookie?: string | null;
          total_pages?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_sync_logs: {
        Row: {
          created_at: string;
          error_message: string | null;
          id: string;
          pages_processed: number;
          pages_updated: number;
          project_id: string;
          status: string;
          sync_completed_at: string | null;
          sync_started_at: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          pages_processed?: number;
          pages_updated?: number;
          project_id: string;
          status: string;
          sync_completed_at?: string | null;
          sync_started_at: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          pages_processed?: number;
          pages_updated?: number;
          project_id?: string;
          status?: string;
          sync_completed_at?: string | null;
          sync_started_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_sync_logs_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'knowledge_projects';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_users: {
        Row: {
          created_at: string;
          display_name: string;
          id: string;
          name: string;
          photo_url: string | null;
          scrapbox_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          id?: string;
          name: string;
          photo_url?: string | null;
          scrapbox_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          id?: string;
          name?: string;
          photo_url?: string | null;
          scrapbox_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      metrics: {
        Row: {
          created_at: string;
          cta: string;
          description: string | null;
          display_name: string;
          href: string;
          icon: string;
          id: string;
          sort_order: number;
          type: Database['public']['Enums']['metric_type'];
          unit: string;
          updated_at: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          cta: string;
          description?: string | null;
          display_name: string;
          href: string;
          icon: string;
          id?: string;
          sort_order: number;
          type: Database['public']['Enums']['metric_type'];
          unit: string;
          updated_at?: string;
          value: number;
        };
        Update: {
          created_at?: string;
          cta?: string;
          description?: string | null;
          display_name?: string;
          href?: string;
          icon?: string;
          id?: string;
          sort_order?: number;
          type?: Database['public']['Enums']['metric_type'];
          unit?: string;
          updated_at?: string;
          value?: number;
        };
        Relationships: [];
      };
      notification_settings: {
        Row: {
          chat_messages: boolean | null;
          created_at: string | null;
          documents: boolean | null;
          email_notifications: boolean | null;
          id: string;
          milestones: boolean | null;
          project_updates: boolean | null;
          system_notifications: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          chat_messages?: boolean | null;
          created_at?: string | null;
          documents?: boolean | null;
          email_notifications?: boolean | null;
          id?: string;
          milestones?: boolean | null;
          project_updates?: boolean | null;
          system_notifications?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          chat_messages?: boolean | null;
          created_at?: string | null;
          documents?: boolean | null;
          email_notifications?: boolean | null;
          id?: string;
          milestones?: boolean | null;
          project_updates?: boolean | null;
          system_notifications?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          is_read: boolean | null;
          link: string | null;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          link?: string | null;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          link?: string | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      otp_challenges: {
        Row: {
          attempts: number;
          challenge_code: string;
          challenge_type: string;
          created_at: string;
          expires_at: string;
          id: string;
          is_verified: boolean;
          updated_at: string;
          user_id: string;
          verification_code: string | null;
        };
        Insert: {
          attempts?: number;
          challenge_code: string;
          challenge_type: string;
          created_at?: string;
          expires_at?: string;
          id?: string;
          is_verified?: boolean;
          updated_at?: string;
          user_id: string;
          verification_code?: string | null;
        };
        Update: {
          attempts?: number;
          challenge_code?: string;
          challenge_type?: string;
          created_at?: string;
          expires_at?: string;
          id?: string;
          is_verified?: boolean;
          updated_at?: string;
          user_id?: string;
          verification_code?: string | null;
        };
        Relationships: [];
      };
      otp_settings: {
        Row: {
          backup_codes: string[] | null;
          created_at: string;
          id: string;
          is_enabled: boolean;
          last_used_at: string | null;
          secret_key: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          backup_codes?: string[] | null;
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          last_used_at?: string | null;
          secret_key?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          backup_codes?: string[] | null;
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          last_used_at?: string | null;
          secret_key?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean;
          last_sign_in_at: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_github_integrations: {
        Row: {
          access_token: string | null;
          branch: string;
          created_at: string | null;
          id: string;
          last_commit_sha: string | null;
          last_synced_at: string | null;
          project_id: string;
          repository_name: string;
          repository_owner: string;
          repository_url: string;
          updated_at: string | null;
          webhook_secret: string | null;
        };
        Insert: {
          access_token?: string | null;
          branch?: string;
          created_at?: string | null;
          id?: string;
          last_commit_sha?: string | null;
          last_synced_at?: string | null;
          project_id: string;
          repository_name: string;
          repository_owner: string;
          repository_url: string;
          updated_at?: string | null;
          webhook_secret?: string | null;
        };
        Update: {
          access_token?: string | null;
          branch?: string;
          created_at?: string | null;
          id?: string;
          last_commit_sha?: string | null;
          last_synced_at?: string | null;
          project_id?: string;
          repository_name?: string;
          repository_owner?: string;
          repository_url?: string;
          updated_at?: string | null;
          webhook_secret?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_github_integrations_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: true;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_milestones: {
        Row: {
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          github_milestone_number: number | null;
          github_url: string | null;
          id: string;
          progress: number | null;
          project_id: string;
          repository_id: number | null;
          status: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          github_milestone_number?: number | null;
          github_url?: string | null;
          id?: string;
          progress?: number | null;
          project_id: string;
          repository_id?: number | null;
          status: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          github_milestone_number?: number | null;
          github_url?: string | null;
          id?: string;
          progress?: number | null;
          project_id?: string;
          repository_id?: number | null;
          status?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_milestones_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_milestones_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'github_repositories';
            referencedColumns: ['id'];
          },
        ];
      };
      project_progress_logs: {
        Row: {
          created_at: string | null;
          description: string;
          hours_spent: number | null;
          id: string;
          log_type: string;
          milestone_id: string | null;
          project_id: string;
          task_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          hours_spent?: number | null;
          id?: string;
          log_type: string;
          milestone_id?: string | null;
          project_id: string;
          task_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          hours_spent?: number | null;
          id?: string;
          log_type?: string;
          milestone_id?: string | null;
          project_id?: string;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_progress_logs_milestone_id_fkey';
            columns: ['milestone_id'];
            isOneToOne: false;
            referencedRelation: 'project_milestones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_progress_logs_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_progress_logs_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      project_repositories: {
        Row: {
          project_id: string;
          repository_id: number;
        };
        Insert: {
          project_id: string;
          repository_id: number;
        };
        Update: {
          project_id?: string;
          repository_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'project_repositories_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_repositories_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'github_repositories';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          emoji: string | null;
          id: string;
          is_archived: boolean | null;
          last_activity_at: string;
          name: string;
          overall_progress: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          emoji?: string | null;
          id?: string;
          is_archived?: boolean | null;
          last_activity_at?: string;
          name: string;
          overall_progress?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          emoji?: string | null;
          id?: string;
          is_archived?: boolean | null;
          last_activity_at?: string;
          name?: string;
          overall_progress?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      role_audit_logs: {
        Row: {
          action: string;
          id: string;
          performed_at: string | null;
          performed_by: string;
          role_name: string;
          role_type: string;
          user_id: string;
        };
        Insert: {
          action: string;
          id?: string;
          performed_at?: string | null;
          performed_by: string;
          role_name: string;
          role_type: string;
          user_id: string;
        };
        Update: {
          action?: string;
          id?: string;
          performed_at?: string | null;
          performed_by?: string;
          role_name?: string;
          role_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          created_at: string;
          id: string;
          permission_id: string;
          role_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_id: string;
          role_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_id?: string;
          role_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_permission_id_fkey';
            columns: ['permission_id'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      role_policies: {
        Row: {
          action: string;
          conditions: Json | null;
          created_at: string;
          effect: string;
          id: string;
          priority: number;
          resource_type: string;
          role_id: string;
          updated_at: string;
        };
        Insert: {
          action: string;
          conditions?: Json | null;
          created_at?: string;
          effect: string;
          id?: string;
          priority?: number;
          resource_type: string;
          role_id: string;
          updated_at?: string;
        };
        Update: {
          action?: string;
          conditions?: Json | null;
          created_at?: string;
          effect?: string;
          id?: string;
          priority?: number;
          resource_type?: string;
          role_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_policies_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      roles: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          type?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_policies: {
        Row: {
          created_at: string;
          id: string;
          ip_restriction: string[] | null;
          max_sessions: number | null;
          require_otp: boolean;
          role_id: string;
          session_timeout: unknown;
          time_restriction: Json | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ip_restriction?: string[] | null;
          max_sessions?: number | null;
          require_otp?: boolean;
          role_id: string;
          session_timeout?: unknown;
          time_restriction?: Json | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          ip_restriction?: string[] | null;
          max_sessions?: number | null;
          require_otp?: boolean;
          role_id?: string;
          session_timeout?: unknown;
          time_restriction?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'session_policies_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: true;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      site_settings: {
        Row: {
          created_at: string;
          enable_blog: boolean;
          enable_contact: boolean;
          enable_estimate: boolean;
          enable_works: boolean;
          favicon_url: string | null;
          id: string;
          is_development_banner_enabled: boolean;
          last_modified_by: string | null;
          maintenance_mode: boolean;
          og_image_url: string | null;
          robots_txt_content: string | null;
          site_description: string;
          site_keywords: string[];
          site_name: string;
          site_status: Database['public']['Enums']['site_status'];
          social_links: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          enable_blog?: boolean;
          enable_contact?: boolean;
          enable_estimate?: boolean;
          enable_works?: boolean;
          favicon_url?: string | null;
          id?: string;
          is_development_banner_enabled?: boolean;
          last_modified_by?: string | null;
          maintenance_mode?: boolean;
          og_image_url?: string | null;
          robots_txt_content?: string | null;
          site_description?: string;
          site_keywords?: string[];
          site_name?: string;
          site_status?: Database['public']['Enums']['site_status'];
          social_links?: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          enable_blog?: boolean;
          enable_contact?: boolean;
          enable_estimate?: boolean;
          enable_works?: boolean;
          favicon_url?: string | null;
          id?: string;
          is_development_banner_enabled?: boolean;
          last_modified_by?: string | null;
          maintenance_mode?: boolean;
          og_image_url?: string | null;
          robots_txt_content?: string | null;
          site_description?: string;
          site_keywords?: string[];
          site_name?: string;
          site_status?: Database['public']['Enums']['site_status'];
          social_links?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skill_categories_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'skill_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      skill_category_relations: {
        Row: {
          category_id: string;
          created_at: string;
          skill_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          skill_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skill_category_relations_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'skill_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skill_category_relations_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      skill_features: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          is_capable: boolean;
          priority: number;
          skill_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          is_capable?: boolean;
          priority?: number;
          skill_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          is_capable?: boolean;
          priority?: number;
          skill_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skill_features_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      skills: {
        Row: {
          created_at: string;
          description: string;
          icon_url: string | null;
          id: string;
          name: string;
          slug: string;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          icon_url?: string | null;
          id?: string;
          name: string;
          slug: string;
          started_at: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon_url?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          started_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sync_errors: {
        Row: {
          created_at: string | null;
          error_message: string;
          id: string;
          resolved_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          error_message: string;
          id?: string;
          resolved_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          error_message?: string;
          id?: string;
          resolved_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      task_assignees: {
        Row: {
          assigned_at: string | null;
          github_user_id: number;
          task_id: string;
        };
        Insert: {
          assigned_at?: string | null;
          github_user_id: number;
          task_id: string;
        };
        Update: {
          assigned_at?: string | null;
          github_user_id?: number;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_assignees_github_user_id_fkey';
            columns: ['github_user_id'];
            isOneToOne: false;
            referencedRelation: 'github_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_assignees_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      task_labels: {
        Row: {
          added_at: string | null;
          label_github_id: number;
          label_repo_id: number;
          task_id: string;
        };
        Insert: {
          added_at?: string | null;
          label_github_id: number;
          label_repo_id: number;
          task_id: string;
        };
        Update: {
          added_at?: string | null;
          label_github_id?: number;
          label_repo_id?: number;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_labels_label_fkey';
            columns: ['label_repo_id', 'label_github_id'];
            isOneToOne: false;
            referencedRelation: 'github_labels';
            referencedColumns: ['repository_id', 'github_label_id'];
          },
          {
            foreignKeyName: 'task_labels_label_repo_id_label_github_id_fkey';
            columns: ['label_repo_id', 'label_github_id'];
            isOneToOne: false;
            referencedRelation: 'github_labels';
            referencedColumns: ['repository_id', 'github_label_id'];
          },
          {
            foreignKeyName: 'task_labels_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          github_issue_number: number | null;
          github_state: string | null;
          github_url: string | null;
          id: string;
          milestone_id: string | null;
          project_id: string;
          repository_id: number | null;
          status: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          github_issue_number?: number | null;
          github_state?: string | null;
          github_url?: string | null;
          id?: string;
          milestone_id?: string | null;
          project_id: string;
          repository_id?: number | null;
          status?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          github_issue_number?: number | null;
          github_state?: string | null;
          github_url?: string | null;
          id?: string;
          milestone_id?: string | null;
          project_id?: string;
          repository_id?: number | null;
          status?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_milestone_id_fkey';
            columns: ['milestone_id'];
            isOneToOne: false;
            referencedRelation: 'project_milestones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'github_repositories';
            referencedColumns: ['id'];
          },
        ];
      };
      technologies: {
        Row: {
          category: Database['public']['Enums']['technology_category'];
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          category: Database['public']['Enums']['technology_category'];
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          category?: Database['public']['Enums']['technology_category'];
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      trusted_devices: {
        Row: {
          browser_info: string | null;
          created_at: string;
          device_id: string;
          device_name: string;
          device_type: string;
          expires_at: string;
          id: string;
          is_active: boolean;
          last_ip: unknown | null;
          last_used_at: string | null;
          os_info: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          browser_info?: string | null;
          created_at?: string;
          device_id: string;
          device_name: string;
          device_type: string;
          expires_at?: string;
          id?: string;
          is_active?: boolean;
          last_ip?: unknown | null;
          last_used_at?: string | null;
          os_info?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          browser_info?: string | null;
          created_at?: string;
          device_id?: string;
          device_name?: string;
          device_type?: string;
          expires_at?: string;
          id?: string;
          is_active?: boolean;
          last_ip?: unknown | null;
          last_used_at?: string | null;
          os_info?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      work_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      work_challenges: {
        Row: {
          created_at: string | null;
          description: string;
          id: string;
          sort_order: number;
          title: string;
          updated_at: string | null;
          work_id: string;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          id?: string;
          sort_order?: number;
          title: string;
          updated_at?: string | null;
          work_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          id?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string | null;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_challenges_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_details: {
        Row: {
          created_at: string | null;
          id: string;
          overview: string;
          period: string;
          role: string;
          team_size: string;
          updated_at: string | null;
          work_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          overview: string;
          period: string;
          role: string;
          team_size: string;
          updated_at?: string | null;
          work_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          overview?: string;
          period?: string;
          role?: string;
          team_size?: string;
          updated_at?: string | null;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_details_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_images: {
        Row: {
          alt: string;
          caption: string | null;
          created_at: string | null;
          id: string;
          sort_order: number;
          updated_at: string | null;
          url: string;
          work_id: string;
        };
        Insert: {
          alt: string;
          caption?: string | null;
          created_at?: string | null;
          id?: string;
          sort_order?: number;
          updated_at?: string | null;
          url: string;
          work_id: string;
        };
        Update: {
          alt?: string;
          caption?: string | null;
          created_at?: string | null;
          id?: string;
          sort_order?: number;
          updated_at?: string | null;
          url?: string;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_images_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_responsibilities: {
        Row: {
          created_at: string | null;
          description: string;
          id: string;
          sort_order: number;
          updated_at: string | null;
          work_id: string;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          id?: string;
          sort_order?: number;
          updated_at?: string | null;
          work_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          id?: string;
          sort_order?: number;
          updated_at?: string | null;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_responsibilities_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_results: {
        Row: {
          created_at: string | null;
          description: string;
          id: string;
          sort_order: number;
          updated_at: string | null;
          work_id: string;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          id?: string;
          sort_order?: number;
          updated_at?: string | null;
          work_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          id?: string;
          sort_order?: number;
          updated_at?: string | null;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_results_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_skills: {
        Row: {
          created_at: string | null;
          description: string;
          highlights: string[] | null;
          id: string;
          skill_id: string;
          updated_at: string | null;
          work_id: string;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          highlights?: string[] | null;
          id?: string;
          skill_id: string;
          updated_at?: string | null;
          work_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          highlights?: string[] | null;
          id?: string;
          skill_id?: string;
          updated_at?: string | null;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_skills_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'work_skills_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_solutions: {
        Row: {
          challenge_id: string | null;
          created_at: string | null;
          description: string;
          id: string;
          sort_order: number;
          title: string;
          updated_at: string | null;
          work_id: string;
        };
        Insert: {
          challenge_id?: string | null;
          created_at?: string | null;
          description: string;
          id?: string;
          sort_order?: number;
          title: string;
          updated_at?: string | null;
          work_id: string;
        };
        Update: {
          challenge_id?: string | null;
          created_at?: string | null;
          description?: string;
          id?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string | null;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_solutions_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'work_challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'work_solutions_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      work_technologies: {
        Row: {
          created_at: string | null;
          technology_id: string;
          work_id: string;
        };
        Insert: {
          created_at?: string | null;
          technology_id: string;
          work_id: string;
        };
        Update: {
          created_at?: string | null;
          technology_id?: string;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_technologies_technology_id_fkey';
            columns: ['technology_id'];
            isOneToOne: false;
            referencedRelation: 'technologies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'work_technologies_work_id_fkey';
            columns: ['work_id'];
            isOneToOne: false;
            referencedRelation: 'works';
            referencedColumns: ['id'];
          },
        ];
      };
      works: {
        Row: {
          category: string;
          created_at: string | null;
          description: string;
          github_url: string | null;
          id: string;
          published_at: string | null;
          slug: string;
          status: Database['public']['Enums']['work_status'];
          thumbnail_url: string;
          title: string;
          updated_at: string | null;
          website_url: string | null;
          work_category_id: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description: string;
          github_url?: string | null;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: Database['public']['Enums']['work_status'];
          thumbnail_url: string;
          title: string;
          updated_at?: string | null;
          website_url?: string | null;
          work_category_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string;
          github_url?: string | null;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: Database['public']['Enums']['work_status'];
          thumbnail_url?: string;
          title?: string;
          updated_at?: string | null;
          website_url?: string | null;
          work_category_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'works_work_category_id_fkey';
            columns: ['work_category_id'];
            isOneToOne: false;
            referencedRelation: 'work_categories';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_admin_user: {
        Args: { target_user_id: string };
        Returns: undefined;
      };
      check_is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      get_admin_users: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          email: string;
          created_at: string;
        }[];
      };
      get_daily_admin_stats: {
        Args: { start_date: string; end_date: string };
        Returns: {
          stat_date: string;
          new_users: number;
          active_users: number;
          contacts: number;
        }[];
      };
      get_overall_admin_stats: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      handle_new_user: {
        Args:
          | { p_user_id: string; p_email: string }
          | {
              p_user_id: string;
              p_email: string;
              p_full_name?: string;
              p_avatar_url?: string;
            };
        Returns: undefined;
      };
      match_blog_posts: {
        Args: {
          query_embedding: string;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: string;
          title: string;
          content: string;
          published_at: string;
          similarity: number;
        }[];
      };
      match_project_templates: {
        Args: {
          query_embedding: string;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          category: string;
          description: string;
          features: Json;
          actual_hours: number;
          actual_cost: number;
          similarity: number;
        }[];
      };
      remove_admin_user: {
        Args: { target_user_id: string };
        Returns: undefined;
      };
      sync_knowledge_projects: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      metric_type:
        | 'development_experience'
        | 'project_count'
        | 'article_count'
        | 'personal_project_count';
      site_status: 'development' | 'staging' | 'production';
      technology_category:
        | 'frontend'
        | 'backend'
        | 'database'
        | 'infrastructure'
        | 'other'
        | 'programming'
        | 'language'
        | 'framework'
        | 'library'
        | 'tool'
        | 'ai';
      work_status: 'draft' | 'published' | 'featured' | 'archived';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  estimate_agent: {
    Enums: {},
  },
  public: {
    Enums: {
      metric_type: [
        'development_experience',
        'project_count',
        'article_count',
        'personal_project_count',
      ],
      site_status: ['development', 'staging', 'production'],
      technology_category: [
        'frontend',
        'backend',
        'database',
        'infrastructure',
        'other',
        'programming',
        'language',
        'framework',
        'library',
        'tool',
        'ai',
      ],
      work_status: ['draft', 'published', 'featured', 'archived'],
    },
  },
} as const;
