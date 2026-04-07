import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator @GetUser() para extraer el usuario del JWT token
 * Usa la propiedad 'user' del request que agrega JwtStrategy
 * 
 * Ejemplo:
 * @Get('profile')
 * getProfile(@GetUser() user: any) {
 *   return user;
 * }
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
