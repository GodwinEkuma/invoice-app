module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'godwinekuma',
    password: '',
    database: 'invoiceapp',
    entities: ['dist/**/*.model.js'],
    migrations: ['dist/src/database/migrations/*.js'],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
  };