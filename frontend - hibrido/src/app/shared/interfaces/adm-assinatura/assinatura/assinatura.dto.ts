import { CreateFormaPagamentoDto, FormaPagamentoDto } from '../../adm-pagamentos/formas-pagamento/forma-pagamento.dto';
import { UserDto } from '../../users/user.dto';
import { PlanoDto } from '../plano/plano.dto';
import { ModalidadesAssinaturaEnum } from './../../../constants/modalidade-assinaturas.const';
import { AssinaturasEnum } from './../../../constants/status-assinaturas.constant';

export interface AssinaturaDto {
    id: string;
    status: AssinaturasEnum;
    modalidade: ModalidadesAssinaturaEnum;
    forma_pagamento: FormaPagamentoDto;

    assinante: UserDto;
    plano_assinatura: PlanoDto;

    data_inicio: Date;
    data_fim: Date;
}

export interface CreateAssinaturaDto {
    modalidade: ModalidadesAssinaturaEnum;
    plano_assinatura_id: string;
    assinante_id: string;
    forma_pagamento: CreateFormaPagamentoDto;
}

export interface UpdateAssinaturaDto {
    status?: AssinaturasEnum;
    modalidade?: ModalidadesAssinaturaEnum;
    plano_assinatura_id: string;
    forma_pagamento?: CreateFormaPagamentoDto;
}

export interface SearchAssinaturaDto {
    searchedAssinatura?: string;
    status?: AssinaturasEnum;
    modalidade?: ModalidadesAssinaturaEnum;
    plano_assinatura_id?: string;
    assinante_id?: string;
    searchedPlano?: string;
    searchedAssinante?: string;
    created_at?: Date;
    data_inicio?: Date;
    data_fim?: Date;
}