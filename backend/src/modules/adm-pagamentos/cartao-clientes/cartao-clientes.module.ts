
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../../shared/authorizations/casl/casl.module';
import { SharedModule } from './../../../shared/modules/shared.module';
import { UsersModule } from './../../users/users.module';

import { CartaoClientesService } from './cartao-clientes.service';
import { CartaoClientesController } from './cartao-clientes.controller';
import { CartaoCliente } from './entities/cartao-cliente.entity';
import { CartaoClientesRepository } from './repositories/implementations/CartaoClientesRepository';
import { SharedOperationsModule } from './../../../shared/modules/shared-operations/shared-operations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartaoCliente]),
    CaslModule,
    forwardRef(() => UsersModule),
    forwardRef(() => SharedModule),
    forwardRef(() => SharedOperationsModule)
  ],
  controllers: [CartaoClientesController],
  providers: [CartaoClientesService, CartaoClientesRepository],
  exports: [CartaoClientesService, CartaoClientesRepository]
})
export class CartaoClientesModule { }
