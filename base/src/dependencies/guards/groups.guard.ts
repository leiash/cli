import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { isString } from "class-validator"
import { Reflector } from '@nestjs/core';

@Injectable()
export class GroupsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }


    async canActivate(context: ExecutionContext) {

        const req: any = context.switchToHttp().getRequest();
        const groups = this.reflector.get<string[]>('groups', context.getHandler());

        try {

            if (!req.user || !req.user.groups || !groups) throw "unknownUser";
            // Check if user is in a group

            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                if (req.user.groups.includes(`${group}`)) return true;
            }

            return false;

        } catch (error) {
            throw new ForbiddenException(isString(error) ? error : error.message);
        }
    }
}
