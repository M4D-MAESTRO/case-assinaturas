import { PageOptionsDto } from './../../../../shared/dtos/page/page-options.dto';
import { ItemDePlano } from "../entities/item-de-plano.entity";
import { SearchItemDePlanoDto } from '../dto/search-item-de-plano.dto';


export interface IItensDePlanosRepository {
    findById(id: string): Promise<ItemDePlano>;
    list(pageOptionsDto: PageOptionsDto, searchDto: SearchItemDePlanoDto): Promise<[ItemDePlano[], number]>;
    listByIds(ids: string[]): Promise<[ItemDePlano[], number]>;
}
