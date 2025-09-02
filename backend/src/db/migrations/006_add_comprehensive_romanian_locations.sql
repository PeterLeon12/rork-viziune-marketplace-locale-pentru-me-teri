-- Migration 006: Add Comprehensive Romanian Locations
-- This replaces the limited areas with a complete database of Romanian cities, counties, and neighborhoods

-- Clear existing limited areas data
DELETE FROM areas;

-- Insert comprehensive Romanian locations (all 41 counties + major cities)

-- ALBA County
INSERT INTO areas (id, name, city) VALUES 
('alba_001', 'Alba Iulia', 'Alba Iulia'),
('alba_002', 'Blaj', 'Blaj'),
('alba_003', 'Sebeș', 'Sebeș'),
('alba_004', 'Aiud', 'Aiud');

-- ARAD County
INSERT INTO areas (id, name, city) VALUES 
('arad_001', 'Arad', 'Arad'),
('arad_002', 'Ineu', 'Ineu'),
('arad_003', 'Lipova', 'Lipova'),
('arad_004', 'Pecica', 'Pecica');

-- ARGEȘ County
INSERT INTO areas (id, name, city) VALUES 
('arges_001', 'Pitești', 'Pitești'),
('arges_002', 'Curtea de Argeș', 'Curtea de Argeș'),
('arges_003', 'Câmpulung', 'Câmpulung'),
('arges_004', 'Mioveni', 'Mioveni');

-- BACĂU County
INSERT INTO areas (id, name, city) VALUES 
('bacau_001', 'Bacău', 'Bacău'),
('bacau_002', 'Onești', 'Onești'),
('bacau_003', 'Moinești', 'Moinești');

-- BIHOR County
INSERT INTO areas (id, name, city) VALUES 
('bihor_001', 'Oradea', 'Oradea'),
('bihor_002', 'Salonta', 'Salonta'),
('bihor_003', 'Marghita', 'Marghita');

-- BISTRIȚA-NĂSĂUD County
INSERT INTO areas (id, name, city) VALUES 
('bistrita_001', 'Bistrița', 'Bistrița'),
('bistrita_002', 'Năsăud', 'Năsăud');

-- BOTOȘANI County
INSERT INTO areas (id, name, city) VALUES 
('botosani_001', 'Botoșani', 'Botoșani'),
('botosani_002', 'Dorohoi', 'Dorohoi');

-- BRAȘOV County
INSERT INTO areas (id, name, city) VALUES 
('brasov_001', 'Brașov', 'Brașov'),
('brasov_002', 'Râșnov', 'Râșnov'),
('brasov_003', 'Săcele', 'Săcele'),
('brasov_004', 'Codlea', 'Codlea'),
('brasov_005', 'Zărnești', 'Zărnești');

-- BRĂILA County
INSERT INTO areas (id, name, city) VALUES 
('braila_001', 'Brăila', 'Brăila');

-- BUCUREȘTI (Capital City + Sectors)
INSERT INTO areas (id, name, city) VALUES 
('bucuresti_001', 'Sector 1', 'București'),
('bucuresti_002', 'Sector 2', 'București'),
('bucuresti_003', 'Sector 3', 'București'),
('bucuresti_004', 'Sector 4', 'București'),
('bucuresti_005', 'Sector 5', 'București'),
('bucuresti_006', 'Sector 6', 'București');

-- BUZĂU County
INSERT INTO areas (id, name, city) VALUES 
('buzau_001', 'Buzău', 'Buzău'),
('buzau_002', 'Râmnicu Sărat', 'Râmnicu Sărat');

-- CARAȘ-SEVERIN County
INSERT INTO areas (id, name, city) VALUES 
('caras_001', 'Reșița', 'Reșița'),
('caras_002', 'Caransebeș', 'Caransebeș');

-- CĂLĂRAȘI County
INSERT INTO areas (id, name, city) VALUES 
('calarasi_001', 'Călărași', 'Călărași'),
('calarasi_002', 'Oltenița', 'Oltenița');

-- CLUJ County (Most detailed since it's a major tech hub)
INSERT INTO areas (id, name, city) VALUES 
('cluj_001', 'Cluj-Napoca', 'Cluj-Napoca'),
('cluj_002', 'Mănăștur', 'Cluj-Napoca'),
('cluj_003', 'Gheorgheni', 'Cluj-Napoca'),
('cluj_004', 'Zorilor', 'Cluj-Napoca'),
('cluj_005', 'Mărăști', 'Cluj-Napoca'),
('cluj_006', 'Grigorescu', 'Cluj-Napoca'),
('cluj_007', 'Centru', 'Cluj-Napoca'),
('cluj_008', 'Florești', 'Florești'),
('cluj_009', 'Turda', 'Turda'),
('cluj_010', 'Dej', 'Dej'),
('cluj_011', 'Gherla', 'Gherla');

-- CONSTANȚA County
INSERT INTO areas (id, name, city) VALUES 
('constanta_001', 'Constanța', 'Constanța'),
('constanta_002', 'Mangalia', 'Mangalia'),
('constanta_003', 'Medgidia', 'Medgidia'),
('constanta_004', 'Năvodari', 'Năvodari');

-- COVASNA County
INSERT INTO areas (id, name, city) VALUES 
('covasna_001', 'Sfântu Gheorghe', 'Sfântu Gheorghe'),
('covasna_002', 'Târgu Secuiesc', 'Târgu Secuiesc');

-- DÂMBOVIȚA County
INSERT INTO areas (id, name, city) VALUES 
('dambovita_001', 'Târgoviște', 'Târgoviște'),
('dambovita_002', 'Moreni', 'Moreni');

-- DOLJ County
INSERT INTO areas (id, name, city) VALUES 
('dolj_001', 'Craiova', 'Craiova'),
('dolj_002', 'Băilești', 'Băilești');

-- GALAȚI County
INSERT INTO areas (id, name, city) VALUES 
('galati_001', 'Galați', 'Galați'),
('galati_002', 'Tecuci', 'Tecuci');

-- GIURGIU County
INSERT INTO areas (id, name, city) VALUES 
('giurgiu_001', 'Giurgiu', 'Giurgiu');

-- GORJ County
INSERT INTO areas (id, name, city) VALUES 
('gorj_001', 'Târgu Jiu', 'Târgu Jiu'),
('gorj_002', 'Motru', 'Motru');

-- HARGHITA County
INSERT INTO areas (id, name, city) VALUES 
('harghita_001', 'Miercurea Ciuc', 'Miercurea Ciuc'),
('harghita_002', 'Odorheiu Secuiesc', 'Odorheiu Secuiesc');

-- HUNEDOARA County
INSERT INTO areas (id, name, city) VALUES 
('hunedoara_001', 'Deva', 'Deva'),
('hunedoara_002', 'Hunedoara', 'Hunedoara'),
('hunedoara_003', 'Petroșani', 'Petroșani');

-- IALOMIȚA County
INSERT INTO areas (id, name, city) VALUES 
('ialomita_001', 'Slobozia', 'Slobozia'),
('ialomita_002', 'Fetești', 'Fetești');

-- IAȘI County
INSERT INTO areas (id, name, city) VALUES 
('iasi_001', 'Iași', 'Iași'),
('iasi_002', 'Pașcani', 'Pașcani'),
('iasi_003', 'Târgu Frumos', 'Târgu Frumos');

-- ILFOV County (Bucharest surroundings)
INSERT INTO areas (id, name, city) VALUES 
('ilfov_001', 'Buftea', 'Buftea'),
('ilfov_002', 'Otopeni', 'Otopeni'),
('ilfov_003', 'Voluntari', 'Voluntari'),
('ilfov_004', 'Pantelimon', 'Pantelimon'),
('ilfov_005', 'Popești-Leordeni', 'Popești-Leordeni');

-- MARAMUREȘ County
INSERT INTO areas (id, name, city) VALUES 
('maramures_001', 'Baia Mare', 'Baia Mare'),
('maramures_002', 'Sighetu Marmației', 'Sighetu Marmației');

-- MEHEDINȚI County
INSERT INTO areas (id, name, city) VALUES 
('mehedinti_001', 'Drobeta-Turnu Severin', 'Drobeta-Turnu Severin'),
('mehedinti_002', 'Orșova', 'Orșova');

-- MUREȘ County
INSERT INTO areas (id, name, city) VALUES 
('mures_001', 'Târgu Mureș', 'Târgu Mureș'),
('mures_002', 'Reghin', 'Reghin'),
('mures_003', 'Sighișoara', 'Sighișoara');

-- NEAMȚ County
INSERT INTO areas (id, name, city) VALUES 
('neamt_001', 'Piatra Neamț', 'Piatra Neamț'),
('neamt_002', 'Roman', 'Roman');

-- OLT County
INSERT INTO areas (id, name, city) VALUES 
('olt_001', 'Slatina', 'Slatina'),
('olt_002', 'Caracal', 'Caracal');

-- PRAHOVA County
INSERT INTO areas (id, name, city) VALUES 
('prahova_001', 'Ploiești', 'Ploiești'),
('prahova_002', 'Câmpina', 'Câmpina'),
('prahova_003', 'Buzău', 'Buzău');

-- SĂLAJ County
INSERT INTO areas (id, name, city) VALUES 
('salaj_001', 'Zalău', 'Zalău'),
('salaj_002', 'Șimleu Silvaniei', 'Șimleu Silvaniei');

-- SATU MARE County
INSERT INTO areas (id, name, city) VALUES 
('satu_mare_001', 'Satu Mare', 'Satu Mare'),
('satu_mare_002', 'Carei', 'Carei');

-- SIBIU County
INSERT INTO areas (id, name, city) VALUES 
('sibiu_001', 'Sibiu', 'Sibiu'),
('sibiu_002', 'Mediaș', 'Mediaș'),
('sibiu_003', 'Cisnădie', 'Cisnădie');

-- SUCEAVA County
INSERT INTO areas (id, name, city) VALUES 
('suceava_001', 'Suceava', 'Suceava'),
('suceava_002', 'Fălticeni', 'Fălticeni'),
('suceava_003', 'Rădăuți', 'Rădăuți');

-- TELEORMAN County
INSERT INTO areas (id, name, city) VALUES 
('teleorman_001', 'Alexandria', 'Alexandria'),
('teleorman_002', 'Rosiori de Vede', 'Rosiori de Vede');

-- TIMIȘ County
INSERT INTO areas (id, name, city) VALUES 
('timis_001', 'Timișoara', 'Timișoara'),
('timis_002', 'Lugoj', 'Lugoj'),
('timis_003', 'Sânnicolau Mare', 'Sânnicolau Mare'),
('timis_004', 'Jimbolia', 'Jimbolia');

-- TULCEA County
INSERT INTO areas (id, name, city) VALUES 
('tulcea_001', 'Tulcea', 'Tulcea'),
('tulcea_002', 'Babadag', 'Babadag');

-- VASLUI County
INSERT INTO areas (id, name, city) VALUES 
('vaslui_001', 'Vaslui', 'Vaslui'),
('vaslui_002', 'Bârlad', 'Bârlad');

-- VÂLCEA County
INSERT INTO areas (id, name, city) VALUES 
('valcea_001', 'Râmnicu Vâlcea', 'Râmnicu Vâlcea'),
('valcea_002', 'Drăgășani', 'Drăgășani');

-- VRANCEA County
INSERT INTO areas (id, name, city) VALUES 
('vrancea_001', 'Focșani', 'Focșani'),
('vrancea_002', 'Adjud', 'Adjud');

-- Create indexes for better performance on the expanded dataset
CREATE INDEX IF NOT EXISTS idx_areas_city ON areas(city);
CREATE INDEX IF NOT EXISTS idx_areas_name ON areas(name);
CREATE INDEX IF NOT EXISTS idx_areas_name_text_search ON areas USING gin(to_tsvector('romanian', name || ' ' || city));
