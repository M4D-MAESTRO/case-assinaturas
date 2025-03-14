import { Controller, Get, Response, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response as Res } from 'express';

import { TemplateCargasService } from './template-cargas.service';
import { Public } from '../../../config/public-endpoint.config';
import { FileTemplateCargas } from '../../../shared/constants/file-templates.constant';

@ApiBearerAuth()
@ApiTags('Templates')
@Controller('templates')
export class TemplateCargasController {
  constructor(private readonly templateCargasService: TemplateCargasService) { }

  @Public()
  @Get('cargas/:id')
  @ApiOperation({ summary: 'Realiza o download de um template de carga' })
  @ApiParam({ name: 'id', enum: FileTemplateCargas })
  @ApiResponse({ status: 200, isArray: false, description: 'Arquivo CSV do template requerido' })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async findCargaTemplate(@Param('id') id: string, @Response() response: Res) {

    const { reportName, file } = await this.templateCargasService.findCargaTemplate(id);

    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.set("Content-Disposition", "attachment;filename=" + reportName);
    response.set("File-name", reportName);
    
    response.send(file);
  }
}
