CREATE TYPE genres AS ENUM (
    'Hip Hop',
    'Pop',
    'Rock',
    'Jazz',
    'Folk',
    'Musical',
    'Country',
    'Classical',
    'Heavy Metal',
    'Rhythm and Blues',
    'Electronic Dance',
    'Punk',
    'Soul',
    'Electronic Music',
    'Rap',
    'Reggae',
    'Funk',
    'Disco',
    'House',
    'Techno',
    'Gospel'
);

CREATE TYPE moods AS ENUM (
    'Happy',
    'Energetic',
    'Sad',
    'Calm',
    'Depression',
    'Anger',
    'Carefree',
    'Gloomy',
    'Annoyed'
);

ALTER TABLE lyric_data
ADD COLUMN
genre genres NOT NULL;

ALTER TABLE lyric_data
ADD COLUMN
mood moods NOT NULL;
