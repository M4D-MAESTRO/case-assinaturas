import { PageOptionsDto } from '../../../../shared/dtos/page/page-options.dto';
import { SearchPlanoDto } from '../dto/search-plano.dto';
import { Plano } from '../entities/plano.entity';


export interface IPlanosRepository {
    findById(id: string): Promise<Plano>;
    list(pageOptionsDto: PageOptionsDto, searchDto: SearchPlanoDto): Promise<[Plano[], number]>;
    listByIds(ids: string[]): Promise<[Plano[], number]>;
    desassociarItens(plano_id: string, ids: string[]): Promise<void>;
}
