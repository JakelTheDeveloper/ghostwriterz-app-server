const knex = require("knex")

const LyricService = {
    getAllLyrics(knex) {
        return knex.select('*').from('lyric_data')
    },
    insertLyrics(knex, newLyrics) {
        // return Promise.resolve({})
        return knex
            .insert(newLyrics)
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
    updateLyrics(knex, id, newLyricsFields) {
        return knex('lyric_data')
            .where({ id })
            .update(newLyricsFields)
    },
}

module.exports = LyricService