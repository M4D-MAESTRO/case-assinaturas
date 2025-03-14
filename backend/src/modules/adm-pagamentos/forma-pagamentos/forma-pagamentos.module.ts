import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../../shared/authorizations/casl/casl.module';
import { UsersModule } from './../../users/users.module';

import { FormaPagamentosService } from './forma-pagamentos.service';
import { FormaPagamento } from './entities/forma-pagamento.entity';
import { CartaoClientesModule } from '../cartao-clientes/cartao-clientes.module';
import { FormaPagamentosRepository } from './repositories/implementations/FormaPagamentosRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormaPagamento]),
    CaslModule,
    forwardRef(() => UsersModule),
    forwardRef(() => CartaoClientesModule),
  ],
  providers: [FormaPagamentosService, FormaPagamentosRepository],
  exports: [FormaPagamentosService, FormaPagamentosRepository]
})
export class FormaPagamentosModule { }
