import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import connection from './connection';
import { getConnection } from 'typeorm';
import { CustomerModel } from '../src/customer/customer.model';

describe('CustomerResolver (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await connection.clear();
    await app.init();
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  const gql = '/graphql';

  describe('createCustomer', () => {
    it('should create a new customer', () => {
      return (
        request(app.getHttpServer())
          .post(gql)
          .send({
            query:
              'mutation {createCustomer(name: "John Doe", email: "john.doe@example.com", phone: "145677312965", address: "123 Road, Springfied, MO") {address name phone email}}',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createCustomer).toEqual({
              name: 'John Doe',
              email: "john.doe@example.com",
              phone: "145677312965",
              address: "123 Road, Springfied, MO"
            });
          })
      )
    })

    it('should get a single customer by id', () => {
      let customer
      return (
        request(app.getHttpServer())
          .post(gql)
          .send({
            query:
              'mutation {createCustomer(name: "John Doe", email: "john.doe@example.com", phone: "145677312965", address: "123 Road, Springfied, MO") {address name id phone email}}',
          })
          .expect(200)
          .expect((res) => {
            customer = res.body.data.createCustomer;
          })
          .then(() =>
            request(app.getHttpServer())
              .post(gql)
              .send({
                query:
                  `{customer(id: "${customer.id}") {address name id phone email}}`,
              })
              .expect(200)
              .expect((res) => {
                expect(res.body.data.customer).toEqual({
                  id: customer.id,
                  address: customer.address, name: customer.name, phone: customer.phone, email: customer.email
                });
              })
          )
      )
    })

    it('should retrieve all customer data', async () => {
      const data = [
        {
          name: 'John Doe',
          email: "john.doe@example.com",
          phone: "145677312965",
          address: "123 Road, Springfied, MO"
        },
        {
          name: 'Jane Doe',
          email: "jane.doe@example.com",
          phone: "145677312900",
          address: "456 Road, Springfied, MO"
        }
      ]
      const connection = await getConnection()
      data.map(async (item) => {
        await connection.createQueryBuilder().insert().into(CustomerModel).values(item).execute()
      })

      request(app.getHttpServer())
      .post(gql)
      .send({
        query:
          `{customers() {address name phone email}}`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.customers.length).toEqual(data.length)
        expect(res.body.data.customers[0]).toEqual(data[0])
      })
    })
  })
});
