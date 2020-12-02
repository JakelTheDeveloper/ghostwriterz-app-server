CREATE TABLE ghostwriterz_users(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    fullname TEXT NOT NULL,
    username TEXT NOT NULL,
    nickname TEXT NOT NULL UNIQUE,
    password varchar(60) NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE lyric_data
ADD COLUMN
artist INTEGER REFERENCES ghostwriterz_users(id)
ON DELETE SET NULL;

ALTER TABLE lyric_data
ADD COLUMN
date_created TIMESTAMPTZ NOT NULL DEFAULT now();