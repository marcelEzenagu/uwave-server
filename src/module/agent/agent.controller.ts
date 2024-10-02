import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('agents')
@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

 
  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
  //   return this.agentService.update(+id, updateAgentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentService.remove(+id);
  // }
}
