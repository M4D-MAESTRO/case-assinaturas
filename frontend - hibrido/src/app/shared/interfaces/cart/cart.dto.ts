import { CreatePedidoDto } from "../pedidos/pedido.dto";

export interface PdvCartDto{
    total: number;
  //  sub_total: number;
    pedido: CreatePedidoDto;
}