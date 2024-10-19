import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('agents')
@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

 
  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get('/details')
  findOne(
    @Req() req:Request) {
    const userID = req['user'].sub
    return this.agentService.findOne(userID);
  }

  @Patch()
  update(
    @Req() req:Request,
    @Body() updateAgentDto: UpdateAgentDto) {
      const userID = req['user'].sub
      updateAgentDto.password =undefined
      updateAgentDto.email =undefined
      updateAgentDto.firstName =undefined
      updateAgentDto.lastName =undefined
    return this.agentService.update(userID, updateAgentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentService.remove(+id);
  // }
}
