import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    InvoiceModule,
    CustomerModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'godwinekuma',
      password: '',
      database: 'invoiceapp',
      entities: ['dist/**/*.model.js'],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
