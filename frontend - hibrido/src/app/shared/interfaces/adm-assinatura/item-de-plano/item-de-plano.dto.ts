
import { ItensPlanosDto } from "../item-plano/item-plano.dto";


export interface ItemDePlanoDto {
    id: string;
    nome: string;
    descricao: string;
    custo?: number;
    quantidade?: number;
    planos?: ItensPlanosDto[];
}

export interface CreateItemDePlanoDto {
    nome: string;
    descricao: string;
    custo?: number;
    quantidade?: number;
}

export interface UpdateItemDePlanoDto {
    nome: string;
    descricao: string;
    custo?: number;
    quantidade?: number;
}


export interface SearchItemDePlanoDto {
    searchedItem?: string;
    nome?: string;
    descricao?: string;
    min_custo?: number;
    max_custo?: number;
    min_quantidade?: number;
    max_quantidade?: number;
    produto_id?: string;
    servico_id?: string;
    created_at?: Date;
}

