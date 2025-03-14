import { PartialType } from '@nestjs/swagger';
import { CreateFormaPagamentoDto } from './create-forma-pagamento.dto';
import { IsUUID } from 'class-validator';

export class UpdateFormaPagamentoDto extends PartialType(CreateFormaPagamentoDto) {
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    id: string;
}
