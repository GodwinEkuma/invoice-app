import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerModel } from './customer.model';
import { CustomerService } from './customer.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('CustomerService', () => {
  let service: CustomerService;
  const customerRepositoryMock: MockType<Repository<CustomerModel>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
           provide: getRepositoryToken(CustomerModel), useValue: customerRepositoryMock ,
     
        }
      ]
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const customerDTO = {
        name: 'John Doe',
        email:'john.doe@email.com',
        phone: '3134045867',
        address: '123 Road, Springfied, MO'
      }
      customerRepositoryMock.save.mockReturnValue(customerDTO);
      const newCustomer = await service.create(customerDTO) 
      expect(newCustomer).toMatchObject(customerDTO)
      expect(customerRepositoryMock.save).toHaveBeenCalledWith(customerDTO)
    })
  })

  describe('findAll', () => {
    it('should find all customers', async () => {
      const customers =  [
         {
          id: '1234',
          name: 'John Doe',
          email:'john.doe@email.com',
          phone: '3134045867',
          address: '123 Road, Springfied, MO'
        },
        
        {
          id: '5678',
          name: 'John Ford',
          email:'john.ford@email.com',
          phone: '3134045867',
          address: '456 Road, Springfied, MO'
        }
      ]
      customerRepositoryMock.find.mockReturnValue(customers);
      const foundCustomers = await service.findAll() 
      expect(foundCustomers).toContainEqual({
        id: '1234',
        name: 'John Doe',
        email:'john.doe@email.com',
        phone: '3134045867',
        address: '123 Road, Springfied, MO'
      })
      expect(customerRepositoryMock.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should find a customer', async () => {
      const customer = {
        id: '1234',
        name: 'John Doe',
        email:'john.doe@email.com',
        phone: '3134045867',
        address: '123 Road, Springfied, MO'
      }
      customerRepositoryMock.findOne.mockReturnValue(customer);
      const foundCustomer = await service.findOne(customer.id) 
      expect(foundCustomer).toMatchObject(customer)
      expect(customerRepositoryMock.findOne).toHaveBeenCalledWith(customer.id)
    })
  })
});
