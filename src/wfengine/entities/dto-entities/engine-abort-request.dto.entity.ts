import { ApiProperty } from '@nestjs/swagger';

export class EngineAbortRequestDto {
  @ApiProperty()
  processInstanceId: string;
}
