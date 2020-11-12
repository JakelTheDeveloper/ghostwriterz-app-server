const knex = require("knex")

const LyricService = {
    getAllArticles(knex){
        return knex.select('*').from('lyric_data')
    }
}

module.exports = LyricService