import { ApiProperty } from "@nestjs/swagger";
import { SuperPageMetaDtoParameters } from "./super-page-meta-parameters.dto";

export class SuperPageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ superPageOptionsDto, itemCount }: SuperPageMetaDtoParameters) {
    this.page = superPageOptionsDto.page;
    this.take = superPageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}