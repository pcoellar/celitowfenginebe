import { ApiProperty } from '@nestjs/swagger';

export class EngineContinueRequestDto {
  @ApiProperty()
  processInstanceId: string;
}
