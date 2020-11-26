module.exports = {
    PORT: process.env.REACT_APP_API_BASE_URL || 8000,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api",
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL|| 'postgresql://jakel:hello@localhost/lyric_dbase',
    TOKEN_KEY: 'ghostwriterz-client-auth-token',
    JWT_SECRET: process.env.JWT_SECRET ||'change-this-secret',
  }