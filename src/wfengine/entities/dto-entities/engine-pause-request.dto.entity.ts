import { ApiProperty } from '@nestjs/swagger';

export class EnginePauseRequestDto {
  @ApiProperty()
  processInstanceId: string;
}
