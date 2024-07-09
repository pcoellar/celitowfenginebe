import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IGetAllProcessInstanceService } from 'src/wfengine/business-logic-layer/usecases/interfaces/process-instance/get-all-process-instance.interface';
import { IGetCountProcessInstanceVersionService } from 'src/wfengine/business-logic-layer/usecases/interfaces/process-instance/get-count-process-instance-version.interface';
import { IGetProcessInstanceService } from 'src/wfengine/business-logic-layer/usecases/interfaces/process-instance/get-process-instance.interface';
import { ProcessInstancesVersionCountResponseDto } from 'src/wfengine/entities/dto-entities/process-instances-version-count-response.dto.entity';

@Controller('process_instance')
@ApiTags('Process Instance')
@ApiResponse({ status: 500, description: 'Internal error' })
export class ProcessInstanceController {
  constructor(
    private readonly getProcessInstanceService: IGetProcessInstanceService,
    private readonly getAllProcessInstanceService: IGetAllProcessInstanceService,
    private readonly getCountProcessInstanceVersionService: IGetCountProcessInstanceVersionService,
  ) {}

  @Get()
  async getAllProcessInstance() {
    const processes = await this.getAllProcessInstanceService.execute();
    return processes;
  }

  @Get(':id')
  async getProcessInstance(@Param('id') id?: string) {
    const process = await this.getProcessInstanceService.execute(id);
    return process;
  }

  @Get('version/:id/count')
  async getCountProcessInstanceVersion(@Param('id') id?: string) {
    const response: ProcessInstancesVersionCountResponseDto =
      await this.getCountProcessInstanceVersionService.execute(id);
    return response;
  }
}
