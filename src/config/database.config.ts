import dotenv from 'dotenv'

dotenv.config();
const database = {
    development:   {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "godwinekuma",
      password: "",
      database: "invoiceapp",
      entities: [
        "dist/**/*.model.js"
      ],
      synchronize: false
    },
    test:  {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: "",
      database: process.env.POSTGRES_DB,
      entities: [
        "src/**/*.model.ts"
      ],
      synchronize: true,
      dropSchema: true,
      migrationsRun: false,
      migrations: [
        "src/database/migrations/*.ts"
      ],
      cli: {
        migrationsDir: "src/database/migrations"
    },
    keepConnectionAlive: true
    }
  }

  const DatabaseConfig = () => ({
    ...database[process.env.NODE_ENV]
  })

  export = DatabaseConfig;