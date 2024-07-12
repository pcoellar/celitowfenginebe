import { ApiProperty } from '@nestjs/swagger';

export class ScriptRequestDto {
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  params: any;
}
