module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://cryptopal@localhost/cryptopal',
  JWT_SECRET: process.env.JWT_SECRET || 'jsgafuyafhiuashfniuyeradhlversdgbsfv',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
}