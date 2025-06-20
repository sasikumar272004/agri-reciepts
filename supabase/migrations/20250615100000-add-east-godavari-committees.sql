-- Add the specified East Godavari District committees
INSERT INTO public.committees (name, code, district, state) VALUES
('Karapa Agricultural Market Committee', 'KARAPA-AMC', 'East Godavari', 'Andhra Pradesh'),
('Kakinada Rural Agricultural Market Committee', 'KAKINADA-RURAL-AMC', 'East Godavari', 'Andhra Pradesh'),
('Pithapuram Agricultural Market Committee', 'PITHAPURAM-AMC', 'East Godavari', 'Andhra Pradesh'),
('Tuni Agricultural Market Committee', 'TUNI-AMC', 'East Godavari', 'Andhra Pradesh'),
('Samalkota Agricultural Market Committee', 'SAMALKOTA-AMC', 'East Godavari', 'Andhra Pradesh'),
('Prathipadu Agricultural Market Committee', 'PRATHIPADU-AMC', 'East Godavari', 'Andhra Pradesh'),
('Jaggampeta Agricultural Market Committee', 'JAGGAMPETA-AMC', 'East Godavari', 'Andhra Pradesh'),
('Peddapuram Agricultural Market Committee', 'PEDDAPURAM-AMC', 'East Godavari', 'Andhra Pradesh'),
('Kakinada Agricultural Market Committee', 'KAKINADA-AMC', 'East Godavari', 'Andhra Pradesh')
ON CONFLICT (name) DO NOTHING;
