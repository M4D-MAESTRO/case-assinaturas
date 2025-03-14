import { UserDto } from "../../users/user.dto";
import { ItensPlanosDto } from "../item-plano/item-plano.dto";


export interface PlanoDto {
    id: string;
    nome: string;
    descricao: string;
    valor_mensal: number;
    valor_trimestral: number;
    valor_semestral: number;
    valor_anual: number;
    custo_mensal: number;
    itens: ItensPlanosDto[];
    user_registrou?: UserDto;
}

export interface CreatePlanoDto {
    nome: string;
    descricao: string;
    valor_mensal: number;
    valor_trimestral?: number;
    valor_semestral?: number;
    valor_anual?: number;
    custo_mensal?: number;
    itens_associar?: string[];
}

export interface UpdatePlanoDto {
    nome: string;
    descricao: string;
    valor_mensal: number;
    valor_trimestral?: number;
    valor_semestral?: number;
    valor_anual?: number;
    custo_mensal?: number;
    itens_associar?: string[];
    itens_desassociar?: string[];
}

export interface AssociarItemPlanoDto{
    itens_associar?: string[];
}

export interface AssociarItemPlanoDto{
    itens_desassociar?: string[];
}

export interface SearchPlanoDto{
    searchedPlano?: string;
    nome?: string;
    descricao?: string;
    min_valor_mensal?: number;
    max_valor_mensal?: number;
    min_valor_trimestral?: number;
    max_valor_trimestral?: number;
    min_valor_semestral?: number;
    max_valor_semestral?: number;
    min_valor_anual?: number;
    max_valor_anual?: number;
    min_custo_mensal?: number;
    max_custo_mensal?: number;
    created_at?: Date;
}