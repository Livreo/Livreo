export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          role: 'client' | 'driver';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string;
          role: 'client' | 'driver';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          role?: 'client' | 'driver';
          created_at?: string;
          updated_at?: string;
        };
      };
      deliveries: {
        Row: {
          id: string;
          pickup_address: string;
          delivery_address: string;
          status: 'pending' | 'accepted' | 'picked' | 'delivered' | 'cancelled';
          price: number;
          distance: number;
          client_id: string;
          driver_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pickup_address: string;
          delivery_address: string;
          status: 'pending' | 'accepted' | 'picked' | 'delivered' | 'cancelled';
          price: number;
          distance: number;
          client_id: string;
          driver_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pickup_address?: string;
          delivery_address?: string;
          status?: 'pending' | 'accepted' | 'picked' | 'delivered' | 'cancelled';
          price?: number;
          distance?: number;
          client_id?: string;
          driver_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}