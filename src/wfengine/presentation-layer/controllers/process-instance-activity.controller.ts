import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IGetAllProcessInstanceActivityService } from 'src/wfengine/business-logic-layer/usecases/interfaces/process-instance-activity/get-all-process-instance.interface';
import { IGetProcessInstanceActivityService } from 'src/wfengine/business-logic-layer/usecases/interfaces/process-instance-activity/get-process-instance.interface';

@Controller('process_instance_activity')
@ApiTags('Process Instance Activity')
@ApiResponse({ status: 500, description: 'Internal error' })
export class ProcessInstanceActivityController {
  constructor(
    private readonly getProcessInstanceActivityService: IGetProcessInstanceActivityService,
    private readonly getAllProcessInstanceActivityService: IGetAllProcessInstanceActivityService,
  ) {}

  @Get()
  async getAllProcessInstanceActivity() {
    const processes = await this.getAllProcessInstanceActivityService.execute();
    return processes;
  }

  @Get(':id')
  async getProcessInstanceActivity(@Param('id') id?: string) {
    const process = await this.getProcessInstanceActivityService.execute(id);
    return process;
  }
}
