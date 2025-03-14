import { ItemDePlanoDto } from "../item-de-plano/item-de-plano.dto";
import { PlanoDto } from "../plano/plano.dto";


export interface ItensPlanosDto{
    id: string;
    plano?: PlanoDto;
    item?: ItemDePlanoDto;
}