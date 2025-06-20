-- Remove old East Godavari District committees
DELETE FROM public.committees
WHERE name IN (
  'Tuni Agricultural Market Committee',
  'Kakinada Agricultural Market Committee',
  'Rajahmundry Agricultural Market Committee',
  'Amalapuram Agricultural Market Committee',
  'Peddapuram Agricultural Market Committee',
  'Ramachandrapuram Agricultural Market Committee',
  'Mandapeta Agricultural Market Committee',
  'Korumilli Agricultural Market Committee',
  'Sankhavaram Agricultural Market Committee',
  'Yelamanchili Agricultural Market Committee'
);
