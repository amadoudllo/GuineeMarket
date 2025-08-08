export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          role: 'client' | 'vendor' | 'admin'
          avatar: string | null
          location: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone: string
          role?: 'client' | 'vendor' | 'admin'
          avatar?: string | null
          location: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          role?: 'client' | 'vendor' | 'admin'
          avatar?: string | null
          location?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          images: string[]
          category: 'electronics' | 'clothing' | 'vehicles' | 'furniture' | 'services'
          condition: 'new' | 'used'
          status: 'pending' | 'approved' | 'rejected'
          vendor_id: string
          location: string
          views: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          images?: string[]
          category: 'electronics' | 'clothing' | 'vehicles' | 'furniture' | 'services'
          condition: 'new' | 'used'
          status?: 'pending' | 'approved' | 'rejected'
          vendor_id: string
          location: string
          views?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          images?: string[]
          category?: 'electronics' | 'clothing' | 'vehicles' | 'furniture' | 'services'
          condition?: 'new' | 'used'
          status?: 'pending' | 'approved' | 'rejected'
          vendor_id?: string
          location?: string
          views?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          product_id: string
          buyer_id: string
          vendor_id: string
          status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          delivery_address: string
          phone: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          buyer_id: string
          vendor_id: string
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          delivery_address: string
          phone: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          buyer_id?: string
          vendor_id?: string
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          delivery_address?: string
          phone?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          product_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          product_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          product_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'client' | 'vendor' | 'admin'
      product_category: 'electronics' | 'clothing' | 'vehicles' | 'furniture' | 'services'
      product_condition: 'new' | 'used'
      product_status: 'pending' | 'approved' | 'rejected'
      order_status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}