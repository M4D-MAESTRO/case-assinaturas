import { Injectable } from '@nestjs/common';
import { AppError } from '../../../errors/AppError';
import { FileTemplateCargas } from '../../../shared/constants/file-templates.constant';
import { CargasCSVTemplates } from '../../../shared/files/templates/cargas-csv.templates';

@Injectable()
export class TemplateCargasService {

  async findCargaTemplate(fileTemplate: string) {
    switch (fileTemplate) {
      case FileTemplateCargas.CARGA_ESTOQUES:
        return await CargasCSVTemplates.cargaEstoque();

      case FileTemplateCargas.CARGA_PRODUTOS:
        return await CargasCSVTemplates.cargaProduto();

      default:
        throw new AppError(`Não existe CSV: ${fileTemplate}`);
    }
  }
}
