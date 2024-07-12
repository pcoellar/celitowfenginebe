import { Injectable } from '@nestjs/common';
import { IGetAllProcessInstanceService } from '../interfaces/process-instance/get-all-process-instance.interface';
import { IProcessInstanceRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-repository.interface';
import { ProcessInstanceResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-response.dto.entity';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';
import { ProcessInstanceResponseParser } from 'src/wfengine/entities/dto-entities/parsers/process-instance-response.dto.parse';

@Injectable()
export class GetAllProcessInstanceService
  implements IGetAllProcessInstanceService
{
  constructor(
    private readonly processInstanceRepositoryService: IProcessInstanceRepositoryService,
  ) {}
  async execute(): Promise<ProcessInstanceResponseDto[]> {
    const processInstanceEntities: ProcessInstanceEntity[] =
      await this.processInstanceRepositoryService.findAll([
        'processInstanceActivities',
      ]);
    const result: ProcessInstanceResponseDto[] = [];
    for (let i = 0; i < processInstanceEntities.length; i++) {
      const getProcessResponseParser = new ProcessInstanceResponseParser();
      const processResponseDto =
        getProcessResponseParser.ParseToProcessInstanceResponseDto(
          processInstanceEntities[i],
        );
      result.push(processResponseDto);
    }
    return result;
  }
}
