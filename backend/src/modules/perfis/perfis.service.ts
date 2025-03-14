import { ClassSerializerInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PageMetaDto } from '../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { AppError } from '../../errors/AppError';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Perfil } from './entities/perfil.entity';
import { PerfisRepository } from './repositories/implementations/PerfisRepository';

@Injectable()
export class PerfisService {

  constructor(
    private readonly perfilRepository: PerfisRepository,
  ) { }
  
  async create(dto: CreatePerfilDto) {
    const perfil = this.perfilRepository.create(dto);
    return await this.perfilRepository.save(perfil);
  }
  
  async findAll(pageOptionsDto: PageOptionsDto) {
    const [perfis, total] = await this.perfilRepository.list(pageOptionsDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(perfis, pageMetaDto);
  }
  
  async findOne(id: string) {
    const perfilExists = await this.checkIfPerfilExists(id);

    return perfilExists;
  }

  
  async update(id: string, dto: UpdatePerfilDto) {
    await this.checkIfPerfilExists(id);
    return plainToClass(Perfil, await this.perfilRepository.save(dto)) as Perfil;
  }

  
  async remove(id: string) {
    await this.checkIfPerfilExists(id);

    await this.perfilRepository.softDelete({ id });
  }

  private async checkIfPerfilExists(id: string): Promise<Perfil> {
    const perfilExists = await this.perfilRepository.findById(id);

    if (!perfilExists) {
      throw new AppError(`Perfil ${id} não encontrado!`, 404);
    }

    return perfilExists;
  }
}
