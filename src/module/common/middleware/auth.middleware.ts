import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.authService.verifyAccessToken(token);
      console.log("decoded__:: ",decoded)

      req['user'] = decoded; // Store the decoded user information in the request object
      const requiredRole = this.getRequiredRole(req.path);

      if (requiredRole && decoded.role !== requiredRole) {
        throw new ForbiddenException(`Access denied. Required role: ${requiredRole}`);
      }

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private getRequiredRole(path: string): string | null {
    // Define your route-specific role requirements here
    if (path.startsWith('/users')) {
      return 'user';
    } else if (path.startsWith('/vendors')) {
      return 'vendor';
    }
    return null; // No specific role required
  }
}
