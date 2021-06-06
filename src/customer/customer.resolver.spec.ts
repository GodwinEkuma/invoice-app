import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../invoice/invoice.service';
import { CustomerDTO } from './customer.dto';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

const invoice = {
  id: '1234',
  invoiceNo: "INV-01",
  description: "GSVBS Website Project",
  customer: {},
  paymentStatus: "Paid",
  currency: "NGN",
  taxRate: 5,
  taxAmount: 8000,
  subTotal: 160000,
  total: 168000,
  amountPaid: "0",
  outstandingBalance: 168000,
  issueDate: "2017-06-06",
  dueDate: "2017-06-20",
  note: "Thank you for your patronage.",
  createdAt: "2017-06-06 11:11:07",
  updatedAt: "2017-06-06 11:11:07"
}
describe('CustomerResolver', () => {
  let resolver: CustomerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerResolver,
        {
          provide: CustomerService,
          useFactory: () => ({
            create: jest.fn((customer: CustomerDTO) => ({
              id: '1234',
              ...customer
            })),
            findAll: jest.fn(() => (
              [
                {
                 id: '1234',
                 name: 'John Doe',
                 email:'john.doe@email.com',
                 phone: '3134045867',
                 address: '123 Road, Springfied, MO',
               },
               
               {
                 id: '5678',
                 name: 'John Ford',
                 email:'john.ford@email.com',
                 phone: '3134045867',
                 address: '456 Road, Springfied, MO'
               }
             ]
            )),
            findOne: jest.fn((id: string) => ({
              id: id,
              name: 'John Doe',
              email:'john.doe@email.com',
              phone: '3134045867',
              address: '123 Road, Springfied, MO'
            }))
          })
        },
        {
          provide: InvoiceService,
          useFactory: () => ({
            findByCustomer: jest.fn((id: string) => (invoice))
          })
        }
      ],
    }).compile();

    resolver = module.get<CustomerResolver>(CustomerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('customer', () => {
    it('should find and return a customer', async () => {
      const customer = await resolver.customer('1234')
      expect(customer).toEqual(
        {
          id: '1234',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '3134045867',
          address: '123 Road, Springfied, MO'
        }
      )
    })
  })

  describe('customers', () => {
    it('should find and return a list of customers', async () => {
      const customers = await resolver.customers()
      expect(customers).toContainEqual(
        {
          id: '1234',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '3134045867',
          address: '123 Road, Springfied, MO'
        }
      )
    })
  })

  describe('invoices', () => {
    it('should find and return a customer invoice', async () => {
      const customer = await resolver.invoices({id: '1234'})
      expect(customer).toEqual(invoice)
    })
  })

  describe('createCustomer', () => {
    it('should find and return a customer invoice', async () => {
      const customer = await resolver.createCustomer(
        'John Doe',
        'john.doe@email.com',
        '3134045867',
        '123 Road, Springfied, MO'
        )
      expect(customer).toEqual(
        {
          id: '1234',
          name: 'John Doe',
          email:'john.doe@email.com',
          phone: '3134045867',
          address: '123 Road, Springfied, MO'
        }
      )
    })
  })
});
