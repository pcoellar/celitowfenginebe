import { ApiProperty } from '@nestjs/swagger';

export class EngineStartRequestDto {
  @ApiProperty()
  processId: string;
  @ApiProperty()
  number: string;
}
