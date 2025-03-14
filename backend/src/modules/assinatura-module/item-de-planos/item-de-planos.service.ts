import { ClassSerializerInterceptor, forwardRef, Inject, Injectable, Scope, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { In } from 'typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';

import { PageMetaDto } from '../../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../../shared/dtos/page/page.dto';
import { AppError } from '../../../errors/AppError';

import { CreateItemDePlanoDto } from './dto/create-item-de-plano.dto';
import { UpdateItemDePlanoDto } from './dto/update-item-de-plano.dto';
import { ItensDePlanosRepository } from './repositories/implementations/ItensDePlanosRepository';
import { SearchItemDePlanoDto } from './dto/search-item-de-plano.dto';
import { ItemDePlano } from './entities/item-de-plano.entity';

@Injectable()
export class ItemDePlanosService {
  constructor(
    private readonly itensDePlanosRepository: ItensDePlanosRepository,
  ) {
  }

  async pageAll(pageOptionsDto: PageOptionsDto, searchDto: SearchItemDePlanoDto) {

    const [itensDePlanos, total] = await this.itensDePlanosRepository.list(pageOptionsDto, searchDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(itensDePlanos, pageMetaDto);
  }


  async create(dto: CreateItemDePlanoDto) {

    const itemDePlano = await this.complementItemServicoOrProduto(dto);
    const createdItemDePlano = await this.itensDePlanosRepository.save(itemDePlano);

    return plainToClass(ItemDePlano, createdItemDePlano);
  }

  async findOne(id: string) {
    const itemDePlanoExists = await this.checkIfItemDePlanoExists(id);
    return instanceToPlain(itemDePlanoExists, { groups: ['find'] }) as ItemDePlano;
  }

  async update(id: string, dto: UpdateItemDePlanoDto) {
    await this.checkIfItemDePlanoExists(id);

    const itemDePlano = await this.complementItemServicoOrProduto(dto);
    itemDePlano.custo = dto.custo;
    itemDePlano.quantidade = dto.quantidade;

    const updatedItemDePlano = await this.itensDePlanosRepository.save(itemDePlano);
    return plainToClass(ItemDePlano, updatedItemDePlano);
  }

  async remove(id: string) {
    await this.checkIfItemDePlanoExists(id);

    await this.itensDePlanosRepository.softDelete({ id });
  }

  async findByIds(ids: string[]) {
    return await this.itensDePlanosRepository.findBy({ id: In(ids) });
  }

  private async complementItemServicoOrProduto(dto: CreateItemDePlanoDto | UpdateItemDePlanoDto) {
    const item = this.itensDePlanosRepository.create(dto);
    const { produto_id, servico_id } = dto;

    if (produto_id && servico_id) {
      throw new AppError(`Um item só pode ser associado a um produto, ou a um serviço por vez!`);
    }

    return item;
  }

  private async checkIfItemDePlanoExists(id: string): Promise<ItemDePlano> {
    const itemDePlanoExists = await this.itensDePlanosRepository.findById(id);

    if (!itemDePlanoExists) {
      throw new AppError(`Item de plano ${id} não encontrado!`, 404);
    }

    return itemDePlanoExists;
  }
}
