-- Исправление баланса пользователя Cheh14: перенос 1000 с balance на oilcoin_balance
UPDATE profiles 
SET oilcoin_balance = oilcoin_balance + 1000,
    balance = balance - 1000,
    updated_at = now()
WHERE user_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa';