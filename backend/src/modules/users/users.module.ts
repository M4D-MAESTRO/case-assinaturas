import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/implementations/UsersRepository';
import { IsUniqueEmailConstraint } from './validations/IsUniqueEmail';
import { IsUniqueCPFConstraint } from './validations/IsUniqueCPF';
import { UserTokens } from './entities/user-token.entity';
import { UsersTokensRepository } from './repositories/implementations/UsersTokensRepository';

import { DayjsDateProvider } from '../../shared/utils/daysDateUtils';
import { UsersTokenService } from './users-token.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { Perfil } from '../perfis/entities/perfil.entity';
import { Endereco } from '../enderecos/entities/endereco.entity';
import { SendMailJobModule } from '../../jobs/email/send-mail-job/send-mail-job.module';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';
import { IsClienteConstraint } from './validations/IsCliente';
import { IsFuncionarioConstraint } from './validations/IsFuncionario';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Perfil, Endereco, UserTokens]),
    MulterModule.register({
      dest: './temp'
    }),
    SharedModule,
    SendMailJobModule,
    CaslModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService, UsersRepository,
    IsUniqueCPFConstraint, IsClienteConstraint, IsUniqueEmailConstraint, IsFuncionarioConstraint,
    UsersTokensRepository,
    UsersTokenService,
    DayjsDateProvider]
  ,
  exports: [
    UsersRepository, UsersService, 
    UsersTokensRepository, UsersTokenService,
    IsUniqueCPFConstraint, IsClienteConstraint, IsUniqueEmailConstraint, IsFuncionarioConstraint,
  ]
})
export class UsersModule { }