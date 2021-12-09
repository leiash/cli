import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { isString } from "class-validator"
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }


    async canActivate(context: ExecutionContext) {

        const req: any = context.switchToHttp().getRequest();
        const permissions = this.reflector.get<string[]>('permissions', context.getHandler());

        try {

            if (!req.user || !req.user.permissions || !permissions) throw "unknownUser";
            // Check if user has a permission

            for (let i = 0; i < permissions.length; i++) {
                const permission = permissions[i];
                if (req.user.permissions.includes(`${permission}`)) return true;
            }

            return false;

        } catch (error) {
            throw new ForbiddenException(isString(error) ? error : error.message);
        }
    }
}
