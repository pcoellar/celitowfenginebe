import { ApiProperty } from '@nestjs/swagger';

export class ScriptRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  params: any;
}
