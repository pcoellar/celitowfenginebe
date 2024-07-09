import { ApiProperty } from '@nestjs/swagger';

export class EngineEventRequestDto {
  @ApiProperty()
  processInstanceId: string;
  @ApiProperty()
  nodeId: string;
}
