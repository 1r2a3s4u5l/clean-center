import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './model/admin.model';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { LoginAdminrDto } from './dto/login-admin.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration(createAdminDto: CreateAdminDto, res: Response) {
    const admin = await this.adminRepo.findOne({
      where: { name: createAdminDto.name },
    });
    if (admin) {
      throw new BadRequestException('AdminName already exists!');
    }
    if (createAdminDto.password !== createAdminDto.confirm_password) {
      throw new BadRequestException('Password is not match');
    }

    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newAdmin = await this.adminRepo.create({
      ...createAdminDto,
      hashed_password: hashed_password,
    });
    const tokens = await this.getTokens(newAdmin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = uuidv4();
    const updatedAdmin = await this.adminRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
        activation_link: uniqueKey,
      },
      {
        where: { id: newAdmin.id },
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
        who: 'admin',
        activation_link: updatedAdmin[1][0].dataValues.activation_link,
        email: updatedAdmin[1][0].dataValues.email,
        name: updatedAdmin[1][0].dataValues.name,
      };
      await this.mailService.sendConfirmation(option);
    } catch (error) {
      console.log(error);
    }
    console.log(2);

    const response = {
      message: 'Admin registered',
      admin: updatedAdmin[1][0],
      tokens,
    };

    return response;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found');
    }
    const updatedAdmin = await this.adminRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );

    if (!updatedAdmin[1][0]) {
      throw new BadRequestException('Admin already activated');
    }
    const response = {
      message: 'Admin activated successfully',
      admin: updatedAdmin,
    };
    return response;
  }

  async login(loginAdminDto: LoginAdminrDto, res: Response) {
    const { email, password } = loginAdminDto;
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) {
      throw new BadRequestException('Admin not registered');
    }
    if (!admin.is_active) {
      throw new BadRequestException('admin is not activated');
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException('Admin not registered(pass)');
    }
    const tokens = await this.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      {
        where: { id: admin.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: 'Admin logged in',
      admin: updatedAdmin[1][0],
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!adminData) {
      throw new ForbiddenException('Admin not found');
    }
    const updatedAdmin = await this.adminRepo.update(
      {
        hashed_refresh_token: null,
      },
      {
        where: { id: adminData.id },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'Admin logged out successfuly',
      admin: updatedAdmin[1][0],
    };
    return response;
  }

  async refreshToken(admin_id: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);
    console.log(decodedToken);

    if (admin_id != decodedToken['id']) {
      throw new BadRequestException('admin not found');
    }
    const admin = await this.adminRepo.findOne({ where: { id: admin_id } });
    if (!admin || !admin.hashed_refresh_token) {
      throw new BadRequestException('admin not found');
    }

    const tokentMatch = await bcrypt.compare(
      refreshToken,
      admin.hashed_refresh_token,
    );

    if (!tokentMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      {
        where: { id: admin.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'Admin refreshed',
      admin: updatedAdmin[1][0],
      tokens,
    };
    return response;
  }

  async getTokens(admin: Admin) {
    const jwtPayload = {
      id: admin.id,
      is_active: admin.is_active,
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
export interface IOption {
  who: string;
  activation_link: string;
  email: string;
  name: string;
}
