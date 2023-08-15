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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from './model/admin.model';
import { Response } from 'express';
import { LoginAdminrDto } from './dto/login-admin.dto';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserSelfGuard } from '../guards/user-self.guard';
import {  ApiTags } from '@nestjs/swagger';
import { AdminSelfGuard } from '../guards/admin-self.guard';
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminsService: AdminService) {}

  @ApiOperation({ summary: 'register Admin' })
  @ApiResponse({ status: 201, type: Admin })
  @Post('signup')
  registration(
    @Body() createAdminDto: CreateAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.registration(createAdminDto, res);
  }

  @ApiOperation({ summary: 'login Admin' })
  @ApiResponse({ status: 200, type: Admin })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  login(
    @Body() loginAdminDto: LoginAdminrDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.login(loginAdminDto, res);
  }

  @ApiOperation({ summary: 'logout Admin' })
  @ApiResponse({ status: 200, type: Admin })
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.logout(refreshToken, res);
  }
  @ApiOperation({ summary: 'refreshToken' })
  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/refresh')
  refresh(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.refreshToken(+id, refreshToken, res);
  }


  @ApiOperation({ summary: 'activated admin' })
  @ApiResponse({ status: 200, type: [Admin] })
  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.adminsService.activate(link);
  }
}
