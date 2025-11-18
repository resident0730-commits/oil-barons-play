-- Удаляем неправильный триггер
DROP TRIGGER IF EXISTS trigger_recalc_income_on_well_change ON wells;
DROP FUNCTION IF EXISTS trigger_recalculate_profile_income();

-- Создаем правильную функцию для пересчета доходности скважин
CREATE OR REPLACE FUNCTION fix_well_income()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  well_record RECORD;
  base_income NUMERIC;
  correct_daily_income NUMERIC;
BEGIN
  -- Перебираем все скважины
  FOR well_record IN SELECT * FROM wells
  LOOP
    -- Определяем базовую доходность в зависимости от типа скважины
    CASE well_record.well_type
      WHEN 'Мини-скважина' THEN base_income := 20000;
      WHEN 'Стартовая скважина' THEN base_income := 50000;
      WHEN 'Средняя скважина' THEN base_income := 120000;
      WHEN 'Промышленная скважина' THEN base_income := 300000;
      WHEN 'Супер-скважина' THEN base_income := 750000;
      WHEN 'Супер скважина' THEN base_income := 750000;
      WHEN 'Премиум-скважина' THEN base_income := 1800000;
      WHEN 'Премиум скважина' THEN base_income := 1800000;
      WHEN 'Элитная скважина' THEN base_income := 4500000;
      WHEN 'Легендарная скважина' THEN base_income := 11000000;
      WHEN 'Космическая скважина' THEN base_income := 27000000;
      ELSE 
        RAISE NOTICE 'Unknown well type: %', well_record.well_type;
        base_income := well_record.daily_income;
    END CASE;
    
    -- Вычисляем правильную доходность: baseIncome * (1 + (level - 1) * 0.5)
    correct_daily_income := FLOOR(base_income * (1 + (well_record.level - 1) * 0.5));
    
    -- Обновляем только если доходность изменилась
    IF well_record.daily_income != correct_daily_income THEN
      UPDATE wells 
      SET daily_income = correct_daily_income,
          updated_at = now()
      WHERE id = well_record.id;
      
      RAISE NOTICE 'Fixed well % (type: %, level: %): % -> %', 
        well_record.id, well_record.well_type, well_record.level,
        well_record.daily_income, correct_daily_income;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'All wells fixed!';
END;
$$;

-- Выполняем исправление
SELECT fix_well_income();

-- Пересчитываем daily_income для всех профилей на основе их скважин
UPDATE profiles p
SET daily_income = COALESCE((
  SELECT SUM(w.daily_income)
  FROM wells w
  WHERE w.user_id = p.user_id
), 0),
updated_at = now();