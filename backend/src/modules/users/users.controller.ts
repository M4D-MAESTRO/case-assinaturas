import {
  Controller, Get, Post, Body, Param, Delete, Put, Query,
  UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Patch, UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { User } from './entities/user.entity';
import { CreateEnderecoDto } from '../enderecos/dto/create-endereco.dto';

import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { Role } from '../../shared/authorizations/enums/role.enum';
import { FolderPathEnum } from '../../shared/constants/folder-path.constant';
import { SearchUserDto } from './dto/search-user.dto';
import { TipoUsuarioEnum } from './../../shared/constants/status-usuario.constant';

@ApiBearerAuth()
@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @ApiOperation(
    {
      summary: 'Recupera um usuário com base no ID passado',
      description: `Recuperar um usuário X com todas as suas informações`
    })
  @ApiResponse({ status: 200, isArray: false, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @ApiOperation({
    summary: 'Lista todos os usuário ativos de acordo com a loja',
    description: `Recupera uma página de usuários com suas informações, opcionalmente pode ser passado o tipo de usuário 
    '${TipoUsuarioEnum.CLIENTE}' ou '${TipoUsuarioEnum.FUNCIONARIO}'`
  })
  @ApiResponse({ status: 200, isArray: true, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async findAll(@Query() filter: SearchUserDto, @Query() dto: PageOptionsDto) {
    return await this.usersService.findAll(filter, dto);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: `Os usuários que estejam com perfil: ${[Role.ADMIN, Role.GERENTE].join("; ")}devem ser capazes de criar novos usuários no sistema.`
  })
  @ApiResponse({ status: 200, isArray: false, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @Post(':id/endereco')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @ApiOperation({ 
    summary: 'Cria/Atualiza o endereço para um usuário',
    description: `Capacidade de criar ou atualizar o endereço de um usuário`
   })
  @ApiResponse({ status: 200, isArray: false, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  createEndereco(@Param('id') id: string, @Body() createEnderecoDto: CreateEnderecoDto) {
    return this.usersService.createUserEndereco(id, createEnderecoDto);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @ApiOperation({ summary: 'Atualiza um usuário', })
  @ApiResponse({ status: 200, isArray: false, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('avatar')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(FileInterceptor('file', { dest: FolderPathEnum.USER_AVATAR,  }))
  @ApiOperation({ 
    summary: 'Atualiza o avatar do usuário logado',
    description: `Usuários ou ${[Role.ADMIN, Role.GERENTE, Role.SUPERVISOR].join("; ")} podem realizar upload de imagem pessoal para uso como avatar de perfil`
   })
  @ApiResponse({ status: 204, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: true, })
  ) file: Express.Multer.File) {
    return this.usersService.updateAvatar(file);
  }


  @Patch('password')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @ApiOperation({ 
    summary: 'Atualiza a senha do usuário logado',
    description: `Esta capacidade atualizar a senha apenas do usuário logado, ou seja, de acordo com o usuário portador do JWT recebido`
   })
  @ApiResponse({ status: 200, isArray: false, type: User })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  updatePassword(@Body() dto: UpdateUserPasswordDto) {
    return this.usersService.updatePassword(dto);
  }
}
