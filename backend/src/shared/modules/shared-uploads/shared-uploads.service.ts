import { AppError } from './../../../errors/AppError';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import * as mime from "mime";

import { ArquivosGeraisRepository } from './repositories/implementations/ArquivosGeraisRepository';
import { SharedService } from '../shared.service';
import { CreateArquivoGeralDto } from './dto/create-arquivo-geral.dto';

@Injectable()
export class SharedUploadsService {
    private readonly logger = new Logger(SharedUploadsService.name);

    constructor(
        @Inject(forwardRef(() => SharedService))
        private readonly sharedService: SharedService,
        private readonly arquivosGeraisRepository: ArquivosGeraisRepository,
    ) { }

    async uploadFileGeral(dto: CreateArquivoGeralDto) {
        const { file, user, provedor, bucket } = dto;
        const nome = await this.sharedService.uploadFile(dto);
        const tipo = mime.getExtension(file.mimetype) as any;

        const arquivoGeral = this.arquivosGeraisRepository.create({
            nome,
            tamanho: file.size,
            tipo,
            user_registrou: user,
            provedor,
            bucket,
        });

        try {
            const createdArquivoGeral = await this.arquivosGeraisRepository.save(arquivoGeral);

            if (!createdArquivoGeral) {
                throw new AppError(`Erro ao salvar arquivo`, 500);
            }

            return createdArquivoGeral;
        } catch (e) {
            this.logger.error(`Erro ao salvar o arquivo geral`);
            this.logger.error(`${e.message}`);
            throw new AppError(`Erro ao salvar arquivo`, 500);
        }
    }

    async findById(id: string) {
        return await this.arquivosGeraisRepository.findById(id);
    }

    async findByIdOrFail(id: string) {
        const arquivoGeral = await this.findById(id);

        if (!arquivoGeral) {
            throw new AppError(`Arquivo ${id} não encontrado`, 404);
        }

        return arquivoGeral;
    }
}
