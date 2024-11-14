import { Controller, Get,BadRequestException, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ShipmentService } from '../shipment/shipment.service';
import { OptionType } from '../order/entities/order.entity';
import { ErrorFormat } from 'src/helpers/errorFormat';

@ApiTags('agents')
@Controller('agents')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly errorFormat: ErrorFormat,

    private readonly shipmentService: ShipmentService,
  ) {}

 
 

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
      const agentID = req['user'].sub
      updateAgentDto.password =undefined
      updateAgentDto.email =undefined
      updateAgentDto.firstName =undefined
      updateAgentDto.lastName =undefined
    return this.agentService.update(agentID, updateAgentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentService.remove(+id);
  // }

  // shipments

  @Get("warehouse")
  findAllOpenShipment(
    @Req() req: Request,
    @Query('orderID') orderID: string, 
    @Query('daysDiff') daysDifference: string,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50 , 
    @Query('status') status: OptionType ,
    @Query("countries") countries:string[],

  ) {
    const agentID = req['user'].sub
    const role = req['user'].role
  
    console.log("findAllOpenShipment",countries)
    page = Number(page);
    limit = Number(limit);
  
    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 100;  // Limit should be between 1 and 100
  
    return this.shipmentService.findShipmentsForAgent(countries,page,limit,status);
  }

  @Patch("warehouse")
 async accept(
    @Req() req: Request,
    @Body() data :any
  ){
    try {
      
    
    console.log("got called","shipmentID",data.shipmentID)
    const agentID = req['user'].sub
    console.log("got called","agentID",agentID)
    const role = req['user'].role
    return await this.shipmentService.acceptShipment(data.shipmentID,agentID)
  } catch (e) {
    throw new BadRequestException(this.errorFormat.formatErrors(e));

  }
  }

}
