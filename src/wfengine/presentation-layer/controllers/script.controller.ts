import { Body, Controller, Post, Put, Param, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAddScriptService } from 'src/wfengine/business-logic-layer/usecases/interfaces/script/add-script.interface';
import { IDeleteScriptService } from 'src/wfengine/business-logic-layer/usecases/interfaces/script/delete-script.interface';
import { IUpdateScriptService } from 'src/wfengine/business-logic-layer/usecases/interfaces/script/update-script.interface';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';
import { ScriptRequestDto } from 'src/wfengine/entities/dto-entities/script-request.dto.entity';

@Controller('scripts')
@ApiTags('Scripts')
@ApiResponse({ status: 500, description: 'Internal error' })
export class ScriptController {
  constructor(
    private readonly addScriptUseCase: IAddScriptService,
    private readonly updateScriptUseCase: IUpdateScriptService,
    private readonly deleteScriptUseCase: IDeleteScriptService,
  ) {}

  @Put()
  async updateScript(@Body() script: ScriptEntity) {
    const updatedScript = await this.updateScriptUseCase.execute(script);
    return updatedScript;
  }

  @Post()
  async addScript(@Body() script: ScriptRequestDto) {
    const userCreated = await this.addScriptUseCase.execute(script);
    return userCreated;
  }

  @Delete(':id')
  async delete(@Param('id') id?: string) {
    await this.deleteScriptUseCase.execute(id);
  }
}
