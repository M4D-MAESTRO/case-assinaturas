import { UserDto } from "../users/user.dto";


export interface CartaoDto {
    id: string;
    tipo: string;
    taxa: number;
    criadoEm: Date;
    alteradoEm: Date;
    inativadoEm: Date | null;
    user_registrou: UserDto;
}