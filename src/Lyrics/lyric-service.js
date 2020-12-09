const knex = require("knex")

const LyricsService = {
    getAllLyrics(knex) {
        return knex.select('*').from('lyric_data')
    },
    insertLyrics(knex, newLyric) {
        return knex
            .insert(newLyric)
            .into('lyric_data')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('lyric_data')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteLyrics(knex, id) {
        return knex('lyric_data')
            .where({ id })
            .delete()
    },
    updateLyrics(knex, id, artist, newLyricFields) {
        return knex('lyric_data')
            .where({ id, artist })
            .update(newLyricFields)
            .returning('*')
    },
}

module.exports = LyricsService