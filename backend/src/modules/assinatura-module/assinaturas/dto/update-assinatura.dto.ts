
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CreateAssinaturaDto } from './create-assinatura.dto';
import { AssinaturasEnum } from './../../../../shared/constants/status-assinaturas.constant';

export class UpdateAssinaturaDto extends PartialType(CreateAssinaturaDto) {
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    id: string;

    @ApiProperty({ description: "Status da assinatura", example: AssinaturasEnum.ATIVO, enum: AssinaturasEnum })
    @IsEnum(AssinaturasEnum, { message: `Status de assinatura inválida` })
    @IsOptional()
    status: AssinaturasEnum;
}
