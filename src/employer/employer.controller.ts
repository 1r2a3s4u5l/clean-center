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
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Employer } from './model/employer.model';
import { Response } from 'express';
import { LoginEmployerrDto } from './dto/login-employer.dto';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { UserSelfGuard } from '../guards/user-self.guard';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('employer')
@Controller('employer')
export class EmployerController {
  constructor(private readonly employersService: EmployerService) {}

  @ApiOperation({ summary: 'register Employer' })
  @ApiResponse({ status: 201, type: Employer })
  @Post('signup')
  registration(
    @Body() createEmployerDto: CreateEmployerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.employersService.registration(createEmployerDto, res);
  }

  @ApiOperation({ summary: 'login Employer' })
  @ApiResponse({ status: 200, type: Employer })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  login(
    @Body() loginEmployerDto: LoginEmployerrDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.employersService.login(loginEmployerDto, res);
  }
  

  @ApiOperation({ summary: 'logout Employer' })
  @ApiResponse({ status: 200, type: Employer })
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.employersService.logout(refreshToken, res);
  }
  @ApiOperation({ summary: 'refreshToken' })
  @Post(':id/refresh')
  @UseGuards(UserSelfGuard)
  @UseGuards(JwtAuthGuard)
  refresh(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.employersService.refreshToken(+id, refreshToken, res);
  }

  @ApiOperation({ summary: 'activated employer' })
  @ApiResponse({ status: 200, type: [Employer] })
  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.employersService.activate(link);
  }
}
