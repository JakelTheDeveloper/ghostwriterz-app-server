CREATE TABLE lyric_data (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT UNIQUE NOT NULL,
    artist TEXT NOT NULL,
    lyrics TEXT NOT NULL
);
