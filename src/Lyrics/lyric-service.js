const knex = require("knex")

const LyricsService = {
    getAllLyrics(knex) {
        return knex.select('*').from('lyric_data')
    },
    insertLyrics(knex, newLyric) {
        // return Promise.resolve({})
        return knex
            .insert(newLyric)
            .into('lyric_data')
            .returning('*')
            //if you dont .then(rows) you'll get {object (id,title,genre,...)}
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
    updateLyrics(knex, id, newLyricFields) {
        return knex('lyric_data')
            .where({ id })
            .update(newLyricFields)
    },
}

module.exports = LyricsService