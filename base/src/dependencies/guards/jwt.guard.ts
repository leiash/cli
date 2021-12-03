import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { isString, isUUID } from "class-validator"
import { AuthService } from '../../modules/core/auth/auth.service';
import { UsersService } from '../../modules/core/users/users.service';

@Injectable()
export class JWTGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private usersService: UsersService
    ) { }

    async canActivate(context: ExecutionContext) {
        const req: any = context.switchToHttp().getRequest();
        const token = req.headers?.authorization?.split("Bearer ")[1];
        if (!token) return false;

        try {

            // Verify JWT
            const decodedToken = this.authService.verifyJWT(token);
            if (typeof decodedToken === "string" || decodedToken.context?.type !== "access") throw "invalidToken";
            if (!isUUID(decodedToken.sub)) throw "invalidToken";

            // Get user
            const user = await this.usersService.findOneByUserId(decodedToken.sub, 'safe');
            if (!user) throw new UnauthorizedException();
            req.user = user;
            req.platformId = decodedToken.context?.platformId;

            return true;

        } catch (error) {
            throw new UnauthorizedException(isString(error) ? error : error.message);
        }
    }
}
