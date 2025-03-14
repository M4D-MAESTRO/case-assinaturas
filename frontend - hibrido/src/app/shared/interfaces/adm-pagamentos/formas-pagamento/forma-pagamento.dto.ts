import { UserDto } from '../../users/user.dto';
import { PagamentoFormasEnum } from '../../../constants/pagamento-formas.constant';
import { CartaoClienteDto } from '../cartao-clientes/cartao-cliente.dto';


export interface FormaPagamentoDto {
    id: string;
    tipo: PagamentoFormasEnum;
    user_registrou: UserDto;
    cartao_cliente?: CartaoClienteDto;
}


export interface CreateFormaPagamentoDto {
    tipo: PagamentoFormasEnum;
    cartao_cliente_id?: string;
}

export interface UpdateFormaPagamentoDto {
    tipo: PagamentoFormasEnum;
    cartao_cliente_id?: string;

}