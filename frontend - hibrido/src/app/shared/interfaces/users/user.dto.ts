
import { StatusUsuarioEnum } from "../../constants/status.constant";
import { TipoUsuarioEnum } from "../../constants/tipo-user.constant";
import { EnderecoDto } from "../enderecos/endereco.dto";
import { PerfilDto } from "../perfis/perfil.dto";

export interface UserDto {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    avatar_url: string | null;
    status: boolean;
    socket_id: string | null;
    perfil: PerfilDto | null;
    endereco: EnderecoDto | null;

}

export interface LabedUser extends UserDto {
    label: string;
}

export interface CreateUserDto {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    perfil_id: string;
}

export interface UpdateUserDto {
    nome?: string;
    status?: string;
    perfil_id?: string;
}

export interface SearchUserDto {
    loja_id?: string;
    searchedUser?: string;
    nome?: string;
    email?: string;
    cpf?: string;
    status?: string;
    tipo_usuario?: TipoUsuarioEnum;
    load_cliente_nao_identificado?: boolean;
}