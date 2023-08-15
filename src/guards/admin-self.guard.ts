import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminSelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.user.is_active == false) {
      throw new UnauthorizedException({
        message: 'Admin active emas',
      });
    }
    if (String(req.user.id) !== req.params.id) {
      throw new ForbiddenException({
        message: 'Ruxsat etilmagan',
      });
    }
    return true; 
  }
}
