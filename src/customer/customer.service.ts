import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './model/customer.model';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { LoginCustomerrDto } from './dto/login-customer.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private readonly customerRepo: typeof Customer,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration(createCustomerDto: CreateCustomerDto, res: Response) {
    const customer = await this.customerRepo.findOne({
      where: { name: createCustomerDto.name },
    });
    if (customer) {
      throw new BadRequestException('CustomerName already exists!');
    }
    if (createCustomerDto.password !== createCustomerDto.confirm_password) {
      throw new BadRequestException('Password is not match');
    }

    const hashed_password = await bcrypt.hash(createCustomerDto.password, 7);
    const newCustomer = await this.customerRepo.create({
      ...createCustomerDto,
      hashed_password: hashed_password,
    });
    const tokens = await this.getTokens(newCustomer);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = uuidv4();
    const updatedCustomer = await this.customerRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
        activation_link: uniqueKey,
      },
      {
        where: { id: newCustomer.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    console.log(1);

    try {
      const option = {
        who: 'customer',
        activation_link: updatedCustomer[1][0].dataValues.activation_link,
        email: updatedCustomer[1][0].dataValues.email,
        name: updatedCustomer[1][0].dataValues.name,
      };
      await this.mailService.sendConfirmation(option);
    } catch (error) {
      console.log(error);
    }
    console.log(2);

    const response = {
      message: 'Customer registered',
      customer: updatedCustomer[1][0],
      tokens,
    };

    return response;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found');
    }
    const updatedCustomer = await this.customerRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );

    if (!updatedCustomer[1][0]) {
      throw new BadRequestException('Customer already activated');
    }
    const response = {
      message: 'Customer activated successfully',
      customer: updatedCustomer,
    };
    return response;
  }

  async login(loginCustomerDto: LoginCustomerrDto, res: Response) {
    const { email, password } = loginCustomerDto;
    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      throw new BadRequestException('Customer not registered');
    }
    if (!customer.is_active) {
      throw new BadRequestException('customer is not activated');
    }
    const isMatchPass = await bcrypt.compare(password, customer.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException('Customer not registered(pass)');
    }
    const tokens = await this.getTokens(customer);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedCustomer = await this.customerRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      {
        where: { id: customer.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: 'Customer logged in',
      customer: updatedCustomer[1][0],
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const customerData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!customerData) {
      throw new ForbiddenException('Customer not found');
    }
    const updatedCustomer = await this.customerRepo.update(
      {
        hashed_refresh_token: null,
      },
      {
        where: { id: customerData.id },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'Customer logged out successfuly',
      customer: updatedCustomer[1][0],
    };
    return response;
  }

  async refreshToken(customer_id: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);

    if (customer_id != decodedToken['id']) {
      throw new BadRequestException('customer not found');
    }
    const customer = await this.customerRepo.findOne({ where: { id: customer_id } });
    if (!customer || !customer.hashed_refresh_token) {
      throw new BadRequestException('customer not found');
    }

    const tokentMatch = await bcrypt.compare(
      refreshToken,
      customer.hashed_refresh_token,
    );

    if (!tokentMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(customer);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedCustomer = await this.customerRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      {
        where: { id: customer.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'Customer refreshed',
      customer: updatedCustomer[1][0],
      tokens,
    };
    return response;
  }

  async getTokens(customer: Customer) {
    const jwtPayload = {
      id: customer.id,
      is_active: customer.is_active,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}