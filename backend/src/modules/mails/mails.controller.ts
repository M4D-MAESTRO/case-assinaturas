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

import { MailsService } from './mails.service';
import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';
import { UserHtmlEmailDto } from './dto/user-html-email.dto';

@ApiBearerAuth()
@ApiTags('Emails')
@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) { }

  @Post('send')
  @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  @ApiOperation({
    summary: 'Email',
  })
  @ApiResponse({ status: 200, isArray: false })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async create(@Body() dto: UserHtmlEmailDto) {
    return await this.mailsService.sendHtmlEmail(dto);
  }
}
