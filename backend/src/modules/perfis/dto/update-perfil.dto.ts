import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreatePerfilDto } from './create-perfil.dto';
export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {
    id: string;
}
