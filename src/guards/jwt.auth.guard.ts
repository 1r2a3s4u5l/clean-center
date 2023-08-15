// import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { Observable } from "rxjs";

// @Injectable()
// export class JwtAuthGuard implements CanActivate{
//     constructor(private readonly jwtService: JwtService) {}
//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const req = context.switchToHttp().getRequest();

//         const authorization = req.headers.authorization;

//         if ( !authorization ) {
//             throw new UnauthorizedException({message: "User is not registered"})
//         }

//         const [bearer, token] = authorization.split(" ");

//         if ( bearer !== "Bearer" || !token ) {
//             throw new UnauthorizedException({message: "User is not registered2"})
//         }

//         let user: any;

//         try {
//             user = this.jwtService.verifyAsync(token, {
//                 secret: process.env.REFRESH_TOKEN_KEY
//             });
//             console.log(authorization);
//         console.log(user)

//         } catch (error) {
//             console.log(error);
//             throw new UnauthorizedException({message: "User is not registered3"})
//         }
//         req.user = user;
//         return true;
//     }
// }

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: "Foydalanuvchi avtorizationdan o'tmagan1",
      });
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: "Foydalanuvchi avtorizationdan o'tmagan2",
      });
    }
    let user: any;
    try {
      user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      console.log(user);
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException({
        message: "Foydalanuvchi avtorizationdan o'tmagan3",
      });
    }
    req.user = user;
    // console.log(req);

    return true;
  }
}
