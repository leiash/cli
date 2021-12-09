import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isUUID } from "class-validator"
import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { AuthService } from "../../modules/core/auth/auth.service"

@Injectable()
export class JWTWSGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext) {

        try {

            const client: Socket = context.switchToWs().getClient<Socket>();
            const token = client.handshake?.query?.token;
            if (!token || typeof token !== "string") return false;

            // Verify JWT
            const decodedToken = this.authService.verifyJWT(token) as JwtPayload;
            if (decodedToken.context?.type !== "access") throw "invalidToken";
            if (!isUUID(decodedToken.sub)) throw "invalidToken";

            return true;
        } catch (error) {
            throw new WsException(error.message);
        }
    }
}
