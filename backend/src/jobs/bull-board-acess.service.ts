import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../shared/authorizations/enums/role.enum';
import { AppError } from '../errors/AppError';

@Injectable()
export class BullBoardAccessService {

    constructor(
        private readonly jwtService: JwtService,
    ) { }


    async validate(authorization) {
        try {
            this.jwtService.verify(authorization);
        } catch (e) {
            throw new AppError(`Não autenticado, por favor, realize login!`, 401);
        }

        try {
            const { perfil_nome } = this.jwtService.decode(authorization) as any;
            if (perfil_nome != Role.ADMIN_TI) {
                throw new AppError(`Não autorizado! É preciso ter o perfil ${Role.ADMIN_TI} para acessar`, 403);
            }

        } catch (e) {
            throw new AppError(`Não autorizado! É preciso ter o perfil ${Role.ADMIN_TI} para acessar`, 403);
        }
    }

}
