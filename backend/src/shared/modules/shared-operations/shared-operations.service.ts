import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';

import { SharedService } from '../../../shared/modules/shared.service';
import { OperationType } from '../../../shared/constants/operation-types.constant';
import { AcaoCarga } from '../../../shared/constants/carga-acao.constant';
import { User } from '../../../modules/users/entities/user.entity';
import { AppError } from './../../../errors/AppError';
import { ValidarCartaoDto } from './../../../shared/dtos/payments/validar-cartao.dto';

@Injectable()
export class SharedOperationsService {

    constructor(
        private readonly sharedService: SharedService,
    ) { }


    async validateCard({ codigo_seguranca, validade, numero_cartao }: ValidarCartaoDto): Promise<string> {
        //TODO - Chamar API para validar o cartao e gerar o token de PGTO
        try {
            const mes = Number(validade.split('/')[0]);
            const ano = Number(validade.split('/')[1]).toString().substring(2);

            if (false) {
                throw new AppError(`Não foi possível validar o cartão para pagamentos`);
            }
            return 'tok_1N0X4U2eZvKYlo2CUQXhaTrt';
        } catch (error) {
            console.error(error);
            throw new AppError(`Não foi possível validar o cartão para pagamentos`);
        }
    }

}
