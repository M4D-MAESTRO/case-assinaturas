import { StatusCartaoEnum, TipoCartaoEnum } from './../../../constants/cartao.constant';
import { UserDto } from "../../users/user.dto";


export interface CartaoClienteDto {
    id: string;
    numero_cartao: string;
    nome_titular: string;
    validade: string;
    token_pagamento?: string;
    ultimos_digitos: string;
    status: StatusCartaoEnum;
    tipo: TipoCartaoEnum;
    cliente: UserDto;
    user_registrou: UserDto;
}

export interface CreateCartaoClienteDto {
    cliente_id: string;
    assinante_id: string;
    numero_cartao: string;

    nome_titular: string;
    validade: string;

    codigo_seguranca: string
    ultimos_digitos: string;
    tipo: TipoCartaoEnum;
    token_pagamento?: string;
}


export interface SearchCartaoClienteDto {
    cliente_id?: string;
    user_registrou_id?: string;
    status?: StatusCartaoEnum;
    tipo?: TipoCartaoEnum;
}