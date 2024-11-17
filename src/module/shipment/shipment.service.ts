import { Injectable } from '@nestjs/common';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment, ShipmentDocument } from './entities/shipment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppGateway } from 'src/app.gateway';
import { OptionType, ShipmentOptionType } from '../order/entities/order.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    private  appGateway: AppGateway

  ){}
  async create(createShipmentDto: Shipment) {
try{


    const newShipment =  new this.shipmentModel(createShipmentDto)
    return await newShipment.save()

    
  } catch(e){
    console.log("createShipment error ",e)
  }
  }
  
  async generateShipmentForOrder(shipment: Shipment) {
    const newShipment = await this.create(shipment)
    await this.appGateway.emitEvent('newShipment', newShipment);
    console.log("Emmited--newShipment")
    return newShipment
  }

  findAll() {
    return `This action returns all shipment`;
  }

  async findShipmentsByCountries(countries: string[]): Promise<Shipment[]> {
    return this.shipmentModel.find({
        destination: { $in: countries },
      }).exec();
  }

  async findShipmentsForAgent(countries: string[],
    page,
    limit: number,    
    status: ShipmentOptionType,
  ) {
      const skip = (page - 1) * limit;
      const filter =  {
        destination: { $in: countries },
        status
      }
      console.log("FILTER::: ",filter)

    const data = await this.shipmentModel.find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

      const total = await this.shipmentModel.countDocuments(filter);
      return {
        data,
        total,
        currentPage: page,
      };
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return `This action updates a #${id} shipment`;
  }

  acceptShipment(shipmentID,agentID,status?: string) {
   
    const presentStatus = ShipmentOptionType[status]
   const newUpdate = presentStatus === ShipmentOptionType.PROCESSING ?
                      {agentID,status: ShipmentOptionType.ACCEPTED}
                    : 
                     presentStatus === ShipmentOptionType.IN_TRANSIT ? 
                      {status: ShipmentOptionType.WAREHOUSED}
                    : 
                     presentStatus === ShipmentOptionType.WAREHOUSED ?
                      {status: ShipmentOptionType.FOR_SHIPPING}
                     :null 
                     presentStatus === ShipmentOptionType.FOR_SHIPPING ?
                      {status: ShipmentOptionType.SHIPPED}
                     :null 

    return this.shipmentModel.findOneAndUpdate({_id: shipmentID},newUpdate,{new:true})
                              .exec();
  }

  rejectShipment(shipmentID,agentID,reason?: string) {
   
   const newUpdate = 
                      {agentID,
                      status: ShipmentOptionType.REJECTED,
                      rejectReason:reason
                      }
                    
    return this.shipmentModel.findOneAndUpdate({_id: shipmentID},newUpdate,{new:true})
                              .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }
}
