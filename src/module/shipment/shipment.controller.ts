import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Frequency, UtilityService } from 'src/helpers/utils';

@Controller('shipments')
export class ShipmentController {
  constructor(
    private readonly shipmentService: ShipmentService,
    private utils: UtilityService,
  ) {}

  @Get()
  findAll() {
    return this.shipmentService.findAll();
  }

  @Get('/chart')
  getMonthlyOrderData(
    @Query('daysDifference') daysDifference: Frequency,
    @Query('agentID') agentID?: string,
  ) {
    const { startDate, endDate } =
      this.utils.calculatePreviousDate(daysDifference);

    let where: any = {};
    if (agentID) where.agentID = agentID;

    return this.shipmentService.getShipmentCountsByMonth(
      agentID,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('HER');

    return this.shipmentService.findOne(+id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    return this.shipmentService.update(+id, updateShipmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipmentService.remove(+id);
  }
}
