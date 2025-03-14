import { PageOptionsDto } from '../../../../shared/dtos/page/page-options.dto';
import { SearchCartaoClienteDto } from '../dto/search-cartao-cliente.dto';
import { CartaoCliente } from '../entities/cartao-cliente.entity';


export interface ICartaoClientesRepository {
    findById(id: string): Promise<CartaoCliente>;
    list(pageOptionsDto: PageOptionsDto, searchDto: SearchCartaoClienteDto): Promise<[CartaoCliente[], number]>;
}
