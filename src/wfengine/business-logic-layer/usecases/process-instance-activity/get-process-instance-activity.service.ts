import { Injectable } from '@nestjs/common';
import { IGetProcessInstanceActivityService } from '../interfaces/process-instance-activity/get-process-instance.interface';
import { IProcessInstanceActivityRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { ProcessInstanceActivityResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-activity-response.dto.entity';
import { ProcessInstanceActivityEntity } from 'src/wfengine/entities/data-entities/process-instance-activity.data.entity';
import { ProcessInstanceActivityResponseParser } from 'src/wfengine/entities/dto-entities/parsers/process-instance-activity-response.dto.parse';

@Injectable()
export class GetProcessInstanceActivityService
  implements IGetProcessInstanceActivityService
{
  constructor(
    private readonly processInstanceActivityRepositoryService: IProcessInstanceActivityRepositoryService,
  ) {}
  async execute(id: string): Promise<ProcessInstanceActivityResponseDto> {
    const processInstanceActivity: ProcessInstanceActivityEntity =
      await this.processInstanceActivityRepositoryService.find(id);
    const getProcessInstanceActivityResponseParser =
      new ProcessInstanceActivityResponseParser();
    const result: ProcessInstanceActivityResponseDto =
      getProcessInstanceActivityResponseParser.ParseToProcessInstanceActivityResponseDto(
        processInstanceActivity,
      );
    return result;
  }
}
