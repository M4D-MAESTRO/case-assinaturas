import { PageOptionsDto } from '../../../../shared/dtos/page/page-options.dto';
import { FormaPagamento } from '../entities/forma-pagamento.entity';

export interface IFormaPagamentosRepository {
    findById(id: string): Promise<FormaPagamento>;
}
