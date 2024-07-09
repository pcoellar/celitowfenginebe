import { Injectable } from '@nestjs/common';
import { IProcessInstanceRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-repository.interface';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';
import { ProcessInstancesVersionCountResponseDto } from 'src/wfengine/entities/dto-entities/process-instances-version-count-response.dto.entity';
import { IGetCountProcessInstanceVersionService } from '../interfaces/process-instance/get-count-process-instance-version.interface';

@Injectable()
export class GetCountProcessInstanceVersionService
  implements IGetCountProcessInstanceVersionService
{
  constructor(
    private readonly processInstanceRepositoryService: IProcessInstanceRepositoryService,
  ) {}
  async execute(
    processVersionId: string,
  ): Promise<ProcessInstancesVersionCountResponseDto> {
    const processInstanceEntities: ProcessInstanceEntity[] =
      await this.processInstanceRepositoryService.findByFilter({
        processVersionId: processVersionId,
      });
    const result: ProcessInstancesVersionCountResponseDto = {
      total: processInstanceEntities.length,
    };
    return result;
  }
}
