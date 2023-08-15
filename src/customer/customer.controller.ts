import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Customer } from './model/customer.model';
import { Response } from 'express';
import { LoginCustomerrDto } from './dto/login-customer.dto';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserSelfGuard } from '../guards/user-self.guard';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customersService: CustomerService) {}

  @ApiOperation({ summary: 'register Customer' })
  @ApiResponse({ status: 201, type: Customer })
  @Post('signup')
  registration(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.registration(createCustomerDto, res);
  }

  @ApiOperation({ summary: 'login Customer' })
  @ApiResponse({ status: 200, type: Customer })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  login(
    @Body() loginCustomerDto: LoginCustomerrDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.login(loginCustomerDto, res);
  }

  @ApiOperation({ summary: 'logout Customer' })
  @ApiResponse({ status: 200, type: Customer })
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: 'refreshToken' })
  @UseGuards(UserSelfGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/refresh')
  refresh(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.refreshToken(+id, refreshToken, res);
  }

  @ApiOperation({ summary: 'activated customer' })
  @ApiResponse({ status: 200, type: [Customer] })
  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.customersService.activate(link);
  }
}
