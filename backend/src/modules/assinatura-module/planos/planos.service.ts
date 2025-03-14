
import { ClassSerializerInterceptor, forwardRef, Inject, Injectable, Scope, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { In } from 'typeorm';
import { instanceToPlain, plainToClass, serialize } from 'class-transformer';

import { UsersService } from '../../users/users.service';
import { getUserIdService } from '../../../shared/utils/user-utils';
import { PageMetaDto } from '../../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../../shared/dtos/page/page.dto';
import { AppError } from '../../../errors/AppError';

import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { PlanosRepository } from './repositories/implementations/PlanosRepository';
import { SearchPlanoDto } from './dto/search-plano.dto';
import { Plano } from './entities/plano.entity';
import { DesassociarItemPlanoDto } from './dto/desassociar-itens-plano.dto';
import { AssociarItemPlanoDto } from './dto/associar-itens-plano.dto';
import { ItensPlanos } from '../itens-planos/entities/itens-planos.entity';
import { SharedService } from './../../../shared/modules/shared.service';

@Injectable({ scope: Scope.REQUEST })
export class PlanosService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly planosRepository: PlanosRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => SharedService))
    private readonly sharedService: SharedService,
  ) { }

  async pageAll(pageOptionsDto: PageOptionsDto, searchDto: SearchPlanoDto) {
    const [planos, total] = await this.planosRepository.list(pageOptionsDto, searchDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(planos, pageMetaDto);
  }

  async create(dto: CreatePlanoDto) {
    const itensAssociar = dto.itens_associar ? await this.getItensDePlano(dto.itens_associar) : undefined;

    const user_id = getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);

    const plano = this.planosRepository.create(dto);

    plano.user_registrou = user;
    plano.itens = itensAssociar;

    const createdPlano = await this.planosRepository.save(plano);

    return plainToClass(Plano, createdPlano);
  }

  async findOne(id: string, showUserRegistrou = false) {
    const planoExists = await this.checkIfPlanoExists(id);
    if (showUserRegistrou) {
      return instanceToPlain(planoExists, { groups: ['find'] }) as Plano;
    }
    return planoExists;
  }

  async update(id: string, dto: UpdatePlanoDto) {
    const user_id = getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);
    const plano = this.planosRepository.create(dto);
    plano.user_registrou = user;

    let { itens } = await this.checkIfPlanoExists(id);
    const itensDePlano = itens.map(i => i.item);
    if (dto.itens_associar) {
      const itensAssociar = await this.getItensDePlano(dto.itens_associar);
      for (const itemAssociar of itensAssociar) {
        const { item } = itemAssociar;
        const index = itensDePlano.findIndex(i => i.id == item.id);
        if (index < 0) {
          itens.push(itemAssociar);
        }
      }
      plano.itens = itens;
    }

    if (dto.itens_desassociar) {
      await this.desassociar(id, { itens_desassociar: dto.itens_desassociar });
      for (const itemDesassociar of dto.itens_desassociar) {
        const index = plano.itens.findIndex(item => item.item.id === itemDesassociar);
        if (index >= 0) {
          plano.itens.splice(index, 1);
        }
      }
      plano.itens = itens;
    }
    const updatedPlano = await this.planosRepository.save(plano);

    return plainToClass(Plano, updatedPlano);
  }

  async associar(id: string, dto: AssociarItemPlanoDto) {
    const plano = await this.checkIfPlanoExists(id);

    const itensAssociar = await this.getItensDePlano(dto.itens_associar);
    for (const itemAssociar of itensAssociar) {
      const index = plano.itens.findIndex(item => item.item.id === itemAssociar.item.id);
      const item = plano.itens[index];
      if (!plano.itens.includes(item)) {
        plano.itens.push(itemAssociar);
      }
    }

    const updatedPlano = await this.planosRepository.save(plano);
    return updatedPlano;
  }

  async desassociar(id: string, dto: DesassociarItemPlanoDto) {
    await this.checkIfPlanoExists(id);
    if (dto.itens_desassociar.length > 0) {
      await this.planosRepository.desassociarItens(id, dto.itens_desassociar);
    }
  }

  async remove(id: string) {
    await this.checkIfPlanoExists(id);

    await this.planosRepository.softDelete({ id });
  }

  private async getItensDePlano(ids: string[]): Promise<ItensPlanos[]> {
    const quantidadeIds = ids.length;
    if (quantidadeIds <= 0) {
      throw new AppError(`Lista de itens está vazia!`, 404);
    }

    const [itens, quantidadeItens] = await this.sharedService.findItensDePlanosByIds(ids);
    if (quantidadeItens != quantidadeIds) {
      throw new AppError(`Não foi possível localizar todos os itens solicitados para associação!`, 404);
    }

    return itens.map(item => {
      const itemPlano = new ItensPlanos();
      itemPlano.item = item;
      return itemPlano;
    });
  }

  private async checkIfPlanoExists(id: string): Promise<Plano> {
    const planoExists = await this.planosRepository.findById(id);

    if (!planoExists) {
      throw new AppError(`Plano ${id} não encontrado!`, 404);
    }

    return planoExists;
  }
}
