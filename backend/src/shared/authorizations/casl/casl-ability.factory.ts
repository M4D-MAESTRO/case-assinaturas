import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, MongoQuery } from "@casl/ability";
import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { AnyObject } from '@casl/ability/dist/types/types';

import { Action } from "../enums/action.enum";
import { Role } from "../enums/role.enum";

import { FuncionalidadesConstants } from './../../constants/funcionalidades.constant';
import { Perfil } from "../../../modules/perfis/entities/perfil.entity";
import { User } from "../../../modules/users/entities/user.entity";
import { BullJobHistory } from "../../../modules/bull-job-histories/entities/bullJobHistory.entity";
import { ItemDePlano } from "./../../../modules/assinatura-module/item-de-planos/entities/item-de-plano.entity";
import { Assinatura } from './../../../modules/assinatura-module/assinaturas/entities/assinatura.entity';
import { Plano } from './../../../modules/assinatura-module/planos/entities/plano.entity';
import { CartaoCliente } from "./../../../modules/adm-pagamentos/cartao-clientes/entities/cartao-cliente.entity";
import { FormaPagamento } from "./../../../modules/adm-pagamentos/forma-pagamentos/entities/forma-pagamento.entity";
import { StatusUsuarioEnum } from "./../../../shared/constants/status-usuario.constant";
import { TiposOperacoesConstant } from './../../constants/tipos-operacoes.constant';
import { SharedService } from './../../modules/shared.service';


type Subjects = InferSubjects<typeof Perfil | typeof User | typeof BullJobHistory
    | typeof ItemDePlano | typeof Plano | typeof Assinatura | typeof CartaoCliente | typeof FormaPagamento
> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    private readonly logger = new Logger(CaslAbilityFactory.name);

    constructor(
        @Inject(forwardRef(() => SharedService))
        private readonly sharedService: SharedService,
    ) { }

    async createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);
        this.logger.log(`Ambiente atual ${process.env.MODE}`);
        if (process.env.MODE == 'DEV') {
            this.logger.log(`Ambiente de teste/desenvolvimento selecionado`);
            this.logger.log(`Liberando acesso total`);
            can(Action.Manage, 'all');
            const buildedPerfil = build({
                detectSubjectType: (item) => {
                    return item.constructor as ExtractSubjectType<Subjects>;
                },
            });
            return buildedPerfil;
        }

        //Libera leitura para todos os perfis:
        this.logger.log(`Configuração inicial`);
        cannot(Action.Manage, 'all');
        can(Action.Create, [CartaoCliente, FormaPagamento]);
        can(Action.Read, [
            CartaoCliente, FormaPagamento,
        ]);

        this.logger.log(`Recuperando autorizações do usuário ${user.id}\n`);
        const [perfil_nome, status] = await this.sharedService.getAllAuthorizationsByUser(user.id);

        this.logger.log(`Status do usuário: ${status}`);
        if (status != StatusUsuarioEnum.ATIVO) {
            this.logger.log(`O usuário não pode operar por estar com o status diferente de ${StatusUsuarioEnum.ATIVO}`);
            cannot(Action.Manage, 'all');
            const buildedPerfil = build({
                detectSubjectType: (item) => {
                    return item.constructor as ExtractSubjectType<Subjects>;
                },
            });
            return buildedPerfil;
        }

        if (perfil_nome) {
            this.definePolicyByRole({ can, cannot, perfil_nome, user_id: user.id });
        } else {
            this.logger.warn(`O usuário ${user.email} não possui perfil definido\n`);
        }

        // Define restricoes do sistema independente de perfil:
        this.logger.log(`\nDefinindo restrições do sistema independente de perfil`);
        this.logger.log(`Não pode deletar: Patrimonio, Perfil, Loja, Area`);
        cannot(Action.Delete, [Perfil]);
        can(Action.Read, [User]);

        const buildedPerfil = build({
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>;
            },
        });

        return buildedPerfil;
    }

    private definePolicyByRole({ can, cannot, perfil_nome, user_id }) {
        this.logger.log(`Definindo política para o perfil ${perfil_nome}\n`);
        // Define politica para o perfil ADMIN_TI:
        if (perfil_nome == Role.ADMIN_TI) {
            can(Action.Manage, [BullJobHistory, Perfil, User,]);
        }

        // Define politica para o perfil ADMIN:
        if (perfil_nome == Role.ADMIN) {
            can(Action.Manage, [User]);
            can(Action.Manage, [Plano, ItemDePlano, Assinatura]);

        }

        // Define politica para o perfil GERENTE:
        if (perfil_nome == Role.GERENTE) {
            can(Action.Manage, [User]);
            can(Action.Manage, [Plano, ItemDePlano, Assinatura]);
            cannot([Action.Create, Action.Delete],);
        }

        // Define politica para o perfil SUPERVISOR:
        if (perfil_nome == Role.SUPERVISOR) {
            can(Action.Manage, [Plano, ItemDePlano, Assinatura]);
            can(Action.Update, [User]);
        }
        // Define politica para o perfil COLABORADOR:
        if (perfil_nome == Role.COLABORADOR) {
            //COLABORADORES devem poder atualizar seu proprio usuario - NOT WORKING
            can(Action.Update, User, { id: { $eq: user_id } });
            can(Action.Create, [Assinatura]);
            can(Action.Update, [Assinatura]);
        }
    }


}