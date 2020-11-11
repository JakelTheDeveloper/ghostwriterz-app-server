DROP TYPE IF EXISTS genres;
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

DROP TYPE IF EXISTS moods;
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

CREATE TABLE IF NOT EXISTS lyric_data (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    genre genres NOT NULL,
    mood moods NOT NULL,
    artist TEXT NOT NULL,
    lyrics TEXT NOT NULL
);
