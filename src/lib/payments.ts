import { supabase } from './supabase';

export type PaymentMethod = {
  id: string;
  type: 'orange_money' | 'mtn_money' | 'moov_money';
  phone: string;
  last4: string;
};

export async function addPaymentMethod(userId: string, type: PaymentMethod['type'], phone: string) {
  const last4 = phone.slice(-4);
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert([
      {
        user_id: userId,
        type,
        phone,
        last4,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function processPayment(deliveryId: string, amount: number) {
  // Simuler un paiement
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { error } = await supabase
    .from('payments')
    .insert([
      {
        delivery_id: deliveryId,
        amount,
        status: 'completed',
      },
    ]);

  if (error) throw error;
  return true;
}