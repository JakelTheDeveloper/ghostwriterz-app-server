module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL|| 'postgresql://jakel:hello@localhost/lyric_dbase',
    TOKEN_KEY: 'ghostwriterz-client-auth-token',
  }