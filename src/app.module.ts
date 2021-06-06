import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';
import { ConnectionOptions } from 'typeorm';
import DatabaseConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig() as ConnectionOptions),
    InvoiceModule,
    CustomerModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
