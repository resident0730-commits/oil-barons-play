-- Удаляем только опасную политику
DROP POLICY IF EXISTS "Service role can manage all invoices" ON public.payment_invoices;