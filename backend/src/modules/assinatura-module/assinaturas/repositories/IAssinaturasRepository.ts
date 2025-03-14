import { PageOptionsDto } from '../../../../shared/dtos/page/page-options.dto';
import { SearchAssinaturaDto } from '../dto/search-assinatura.dto';
import { Assinatura } from '../entities/assinatura.entity';


export interface IAssinaturasRepository {
    findById(id: string): Promise<Assinatura>;
    findByUserIdAndPlanoId(user_id: string, plano_id: string): Promise<Assinatura>;
    list(pageOptionsDto: PageOptionsDto, searchDto: SearchAssinaturaDto): Promise<[Assinatura[], number]>;
}
