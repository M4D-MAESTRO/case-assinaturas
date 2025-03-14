import { Request } from 'express';
import { CanActivate, ExecutionContext, HttpException, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Perfil } from "../../../modules/perfis/entities/perfil.entity";
import { User } from "../../../modules/users/entities/user.entity";
import { AppAbility, CaslAbilityFactory } from "../casl/casl-ability.factory";
import { CHECK_POLICIES_KEY } from "./check-policies.const";
import { PolicyHandler } from "./IPolicyHandler";

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger = new Logger(PoliciesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user, path, method } = context.switchToHttp().getRequest<any>();

    this.logger.log(`Usuário ${user.email} solicitando autorização`);
    this.logger.log(`Método: ${method}`);
    this.logger.log(`Caminho: ${path}`);

    const ability = await this.caslAbilityFactory.createForUser(user);

    const result = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );

    if (!result) {
      this.logger.warn(`${user.email} não está autorizado`);
      throw new HttpException(`Você não tem autorização para realizar esta ação!`, 403);
    }

    this.logger.warn(`${user.email} está autorizado`);
    return result;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}