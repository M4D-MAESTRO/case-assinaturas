
import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { S3 } from "aws-sdk";
import * as fs from "fs";
import * as mime from "mime";
import { resolve } from "path";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppError } from '../../errors/AppError';
import { Perfil } from '../../modules/perfis/entities/perfil.entity';
import { CreateNotificacoeDto } from '../../modules/notificacoes/dto/create-notificacoe.dto';
import { Notificacao } from '../../modules/notificacoes/entities/notificacoe.entity';
import { ItensDePlanosRepository } from './../../modules/assinatura-module/item-de-planos/repositories/implementations/ItensDePlanosRepository';
import { PlanosRepository } from './../../modules/assinatura-module/planos/repositories/implementations/PlanosRepository';
import { Plano } from './../../modules/assinatura-module/planos/entities/plano.entity';
import { ProvidersEnum } from '../constants/providers.constant';
import { CreateArquivoGeralDto, DeleteArquivoGeralDto } from './shared-uploads/dto/create-arquivo-geral.dto';
import { PerfisRepository } from './../../modules/perfis/repositories/implementations/PerfisRepository';

@Injectable()
export class SharedService {
  private client: S3;

  constructor(
    @InjectRepository(Notificacao)
    private readonly notificacaoRepository: Repository<Notificacao>,
    private readonly itensDePlanosRepository: ItensDePlanosRepository,
    private readonly planosRepository: PlanosRepository,
    private readonly perfisRepository: PerfisRepository,
  ) {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async findPlanosByIds(ids: string[]) {
    return this.planosRepository.listByIds(ids);
  }

  async findOnePlano(id: string) {
    const planoExists = await this.planosRepository.findById(id);

    if (!planoExists) {
      throw new AppError(`Plano ${id} não encontrado!`, 404);
    }
    return instanceToPlain(planoExists, { groups: ['find'] }) as Plano;
  }

  async findItensDePlanosByIds(ids: string[]) {
    return this.itensDePlanosRepository.listByIds(ids);
  }


  async findOnePerfil(id: string) {
    const perfilExists = await this.perfisRepository.findById(id);

    if (!perfilExists) {
      throw new AppError(`Perfil ${id} não encontrado!`, 404);
    }
    return instanceToPlain(perfilExists, { groups: ['find'] }) as Perfil;
  }


  async getAllAuthorizationsByUser(user_id: string) {
    return await this.perfisRepository.getAllAuthorizationsByUser(user_id);
  }

  async uploadFile({ file, folder, bucket, provedor }: CreateArquivoGeralDto) {
    const extension = mime.getExtension(file.mimetype);
    await fs.promises.rename(file.path, `${file.path}.${extension}`);
    file.filename = `${file.filename}.${extension}`;

    const { filename } = file;

    if (provedor == ProvidersEnum.AWS) {
      const { mimetype, path } = file;
      const Body = await fs.promises.readFile(`${path}.${extension}`);
      const ContentType = mime.getType(mimetype);

      await this.client
        .putObject({
          Bucket: `${bucket}/${folder}`,
          Key: filename,
          Body,
          ContentType,
          ACL: "public-read",
        })
        .promise();

      await fs.promises.unlink(`${path}.${extension}`);
    }

    return filename;

  }

  async deleteFile({ file_name, folder, bucket, provedor }: DeleteArquivoGeralDto): Promise<void> {
    if (provedor == ProvidersEnum.AWS) {
      await this.client
        .deleteObject({
          Bucket: `${bucket}/${folder}`,
          Key: file_name,
        })
        .promise();
    } else {
      const filename = resolve(`temp`, file_name);
      try {
        await fs.promises.stat(filename);
        await fs.promises.unlink(filename);
      } catch {
        return;
      }
    }
  }

  async createNewNotification(createNotificacoeDto: CreateNotificacoeDto) {
    const notificacao = this.notificacaoRepository.create(createNotificacoeDto);
    notificacao.is_read = false;
    return await this.notificacaoRepository.save(notificacao);
  }



}