import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Employer } from './model/employer.model';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { LoginEmployerrDto } from './dto/login-employer.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel(Employer) private readonly employerRepo: typeof Employer,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration(createEmployerDto: CreateEmployerDto, res: Response) {
    const employer = await this.employerRepo.findOne({
      where: { name: createEmployerDto.name },
    });
    if (employer) {
      throw new BadRequestException('EmployerName already exists!');
    }
    if (createEmployerDto.password !== createEmployerDto.confirm_password) {
      throw new BadRequestException('Password is not match');
    }

    const hashed_password = await bcrypt.hash(createEmployerDto.password, 7);
    const newEmployer = await this.employerRepo.create({
      ...createEmployerDto,
      hashed_password: hashed_password,
    });
    const tokens = await this.getTokens(newEmployer);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = uuidv4();
    const updatedEmployer = await this.employerRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
        activation_link: uniqueKey,
      },
      {
        where: { id: newEmployer.id },
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
        who: 'employer',
        activation_link: updatedEmployer[1][0].dataValues.activation_link,
        email: updatedEmployer[1][0].dataValues.email,
        name: updatedEmployer[1][0].dataValues.name,
      };
      await this.mailService.sendConfirmation(option);
    } catch (error) {
      console.log(error);
    }
    console.log(2);

    const response = {
      message: 'Employer registered',
      employer: updatedEmployer[1][0],
      tokens,
    };

    return response;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found');
    }
    const updatedEmployer = await this.employerRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );

    if (!updatedEmployer[1][0]) {
      throw new BadRequestException('Employer already activated');
    }
    const response = {
      message: 'Employer activated successfully',
      employer: updatedEmployer,
    };
    return response;
  }

  async login(loginEmployerDto: LoginEmployerrDto, res: Response) {
    const { email, password } = loginEmployerDto;
    const employer = await this.employerRepo.findOne({ where: { email } });
    if (!employer) {
      throw new BadRequestException('Employer not registered');
    }
    if (!employer.is_active) {
      throw new BadRequestException('employer is not activated');
    }
    const isMatchPass = await bcrypt.compare(password, employer.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException('Employer not registered(pass)');
    }
    const tokens = await this.getTokens(employer);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedEmployer = await this.employerRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      {
        where: { id: employer.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: 'Employer logged in',
      employer: updatedEmployer[1][0],
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const employerData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!employerData) {
      throw new ForbiddenException('Employer not found');
    }
    const updatedEmployer = await this.employerRepo.update(
      {
        hashed_refresh_token: null,
      },
      {
        where: { id: employerData.id },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'Employer logged out successfuly',
      employer: updatedEmployer[1][0],
    };
    return response;
  }

  async refreshToken(employer_id: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);

    if (employer_id != decodedToken['id']) {
      throw new BadRequestException('employer not found');
    }
    const employer = await this.employerRepo.findOne({ where: { id: employer_id } });
    if (!employer || !employer.hashed_refresh_token) {
      throw new BadRequestException('employer not found');
    }

    const tokentMatch = await bcrypt.compare(
      refreshToken,
      employer.hashed_refresh_token,
    );

    if (!tokentMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(employer);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedEmployer = await this.employerRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      {
        where: { id: employer.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'Employer refreshed',
      employer: updatedEmployer[1][0],
      tokens,
    };
    return response;
  }

  async getTokens(employer: Employer) {
    const jwtPayload = {
      id: employer.id,
      is_active: employer.is_active,
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