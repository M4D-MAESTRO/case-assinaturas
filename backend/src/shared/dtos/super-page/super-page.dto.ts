import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { SuperPageMetaDto } from "./super-page-meta.dto";

export class SuperPageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => SuperPageMetaDto })
  readonly meta: SuperPageMetaDto;

  constructor(data: T[], meta?: SuperPageMetaDto) {
    this.data = data;
    this.meta = meta;
  }

}