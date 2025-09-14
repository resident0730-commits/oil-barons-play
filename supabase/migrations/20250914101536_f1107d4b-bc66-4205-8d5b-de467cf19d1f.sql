-- Update bot names to more realistic Steam/Reddit style usernames
UPDATE public.bot_players SET 
  nickname = CASE 
    WHEN nickname = 'Нефтяной Магнат' THEN 'xX_OilKing_Xx'
    WHEN nickname = 'Барон Буровых' THEN 'DrillMaster2024'
    WHEN nickname = 'Король Нефти' THEN 'PetroliumLord'
    WHEN nickname = 'Газовый Гигант' THEN 'GasGiant_420'
    WHEN nickname = 'Промышленник' THEN 'IndustrialBeast'
    WHEN nickname = 'Энергетический Босс' THEN 'EnergyWolf_77'
    WHEN nickname = 'Скважинный Эксперт' THEN 'WellDigger_Pro'
    WHEN nickname = 'Ресурсный Лидер' THEN 'ResourceHunter'
    WHEN nickname = 'Топливный Тайкун' THEN 'FuelTycoon_88'
    WHEN nickname = 'Буровой Специалист' THEN 'DeepDriller_2k'
    WHEN nickname = 'Нефтяной Инвестор' THEN 'OilInvestor_99'
    WHEN nickname = 'Энергетический Гуру' THEN 'PowerGuru_Elite'
    WHEN nickname = 'Газовый Магистр' THEN 'GasMaster_X'
    WHEN nickname = 'Промышленный Гений' THEN 'IndustryGenius'
    WHEN nickname = 'Ресурсный Мастер' THEN 'ResourceKing_21'
    WHEN nickname = 'Скважинный Виртуоз' THEN 'WellVirtuoso_3'
    WHEN nickname = 'Топливный Эксперт' THEN 'FuelExpert_007'
    WHEN nickname = 'Буровой Мастер' THEN 'DrillingSensei'
    WHEN nickname = 'Нефтяной Стратег' THEN 'OilStrategist_5'
    WHEN nickname = 'Энергетический Новатор' THEN 'EnergyNoob_123'
    ELSE nickname
  END,
  updated_at = now()
WHERE nickname IN (
  'Нефтяной Магнат', 'Барон Буровых', 'Король Нефти', 'Газовый Гигант',
  'Промышленник', 'Энергетический Босс', 'Скважинный Эксперт', 
  'Ресурсный Лидер', 'Топливный Тайкун', 'Буровой Специалист',
  'Нефтяной Инвестор', 'Энергетический Гуру', 'Газовый Магистр',
  'Промышленный Гений', 'Ресурсный Мастер', 'Скважинный Виртуоз',
  'Топливный Эксперт', 'Буровой Мастер', 'Нефтяной Стратег',
  'Энергетический Новатор'
);