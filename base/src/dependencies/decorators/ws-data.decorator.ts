import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const WsData = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.switchToWs().getData()
    }
)