import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IWfAbortService } from 'src/wfengine/business-logic-layer/usecases/interfaces/engine/wf-abort.interface';
import { IWfContinueService } from 'src/wfengine/business-logic-layer/usecases/interfaces/engine/wf-continue.interface';
import { IWfEventService } from 'src/wfengine/business-logic-layer/usecases/interfaces/engine/wf-event.interface';
import { IWfPauseService } from 'src/wfengine/business-logic-layer/usecases/interfaces/engine/wf-pause.interface';
import { IWfStartService } from 'src/wfengine/business-logic-layer/usecases/interfaces/engine/wf-start.interface';
import { EngineAbortRequestDto } from 'src/wfengine/entities/dto-entities/engine-abort-request.dto.entity';
import { EngineContinueRequestDto } from 'src/wfengine/entities/dto-entities/engine-continue-request.dto.entity';
import { EngineEventRequestDto } from 'src/wfengine/entities/dto-entities/engine-event-request.dto.entity';
import { EnginePauseRequestDto } from 'src/wfengine/entities/dto-entities/engine-pause-request.dto.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { EngineStartRequestDto } from 'src/wfengine/entities/dto-entities/engine-start-request.dto.entity';

@Controller('wfengine')
@ApiTags('Workflow Engine')
@ApiResponse({ status: 500, description: 'Internal error' })
export class WFEngineController {
  constructor(
    private readonly wfStartService: IWfStartService,
    private readonly wfEventService: IWfEventService,
    private readonly wfAbortService: IWfAbortService,
    private readonly wfContinueService: IWfContinueService,
    private readonly wfPauseService: IWfPauseService,
  ) {}

  @Post('start')
  async start(@Body() request: EngineStartRequestDto) {
    const engineResponse: EngineResponseDto =
      await this.wfStartService.execute(request);
    return engineResponse;
  }

  @Post('event')
  async onEvent(@Body() request: EngineEventRequestDto) {
    const engineResponse: EngineResponseDto =
      await this.wfEventService.execute(request);
    return engineResponse;
  }

  @Post('pause')
  async pause(@Body() request: EnginePauseRequestDto) {
    const engineResponse: EngineResponseDto =
      await this.wfPauseService.execute(request);
    return engineResponse;
  }

  @Post('abort')
  async abort(@Body() request: EngineAbortRequestDto) {
    const engineResponse: EngineResponseDto =
      await this.wfAbortService.execute(request);
    return engineResponse;
  }

  @Post('continue')
  async continue(@Body() request: EngineContinueRequestDto) {
    const engineResponse: EngineResponseDto =
      await this.wfContinueService.execute(request);
    return engineResponse;
  }
}
