ALTER TABLE lyric_data
DROP COLUMN artist;

ALTER TABLE lyric_data 
DROP COLUMN IF EXISTS date_created;

DROP TABLE IF EXISTS ghostwriterz_users;