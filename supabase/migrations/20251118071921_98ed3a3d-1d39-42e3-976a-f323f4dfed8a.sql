-- Функция для пересчета доходности скважины на основе её уровня
CREATE OR REPLACE FUNCTION recalculate_well_income()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  well_record RECORD;
  base_income NUMERIC;
  new_daily_income NUMERIC;
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
      WHEN 'Супер скважина' THEN base_income := 750000;
      WHEN 'Премиум скважина' THEN base_income := 1800000;
      WHEN 'Элитная скважина' THEN base_income := 4500000;
      WHEN 'Легендарная скважина' THEN base_income := 11000000;
      WHEN 'Космическая скважина' THEN base_income := 27000000;
      ELSE base_income := well_record.daily_income; -- Если тип неизвестен, оставляем как есть
    END CASE;
    
    -- Вычисляем новую доходность по формуле: baseIncome * (1 + (level - 1) * 0.5)
    new_daily_income := FLOOR(base_income * (1 + (well_record.level - 1) * 0.5));
    
    -- Обновляем скважину
    UPDATE wells 
    SET daily_income = new_daily_income,
        updated_at = now()
    WHERE id = well_record.id;
  END LOOP;
  
  RAISE NOTICE 'Доходность всех скважин пересчитана';
END;
$$;

-- Выполняем пересчет
SELECT recalculate_well_income();

-- Создаем триггер для автоматического пересчета daily_income профиля после обновления скважин
CREATE OR REPLACE FUNCTION trigger_recalculate_profile_income()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_income NUMERIC;
BEGIN
  -- Вычисляем общую доходность всех скважин пользователя
  SELECT COALESCE(SUM(daily_income), 0)
  INTO total_income
  FROM wells
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  -- Обновляем профиль пользователя
  UPDATE profiles
  SET daily_income = total_income,
      updated_at = now()
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Создаем триггер на INSERT, UPDATE и DELETE скважин
DROP TRIGGER IF EXISTS trigger_recalc_income_on_well_change ON wells;
CREATE TRIGGER trigger_recalc_income_on_well_change
AFTER INSERT OR UPDATE OR DELETE ON wells
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_profile_income();