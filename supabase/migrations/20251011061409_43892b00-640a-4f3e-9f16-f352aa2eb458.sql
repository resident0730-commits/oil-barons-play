-- Создаем таблицу для хранения связи между InvoiceID и UserID
CREATE TABLE IF NOT EXISTS public.payment_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Индекс для быстрого поиска по invoice_id
CREATE INDEX idx_payment_invoices_invoice_id ON public.payment_invoices(invoice_id);

-- RLS политики
ALTER TABLE public.payment_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
ON public.payment_invoices
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all invoices"
ON public.payment_invoices
FOR ALL
USING (true)
WITH CHECK (true);