import { Injectable } from '@nestjs/common';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment, ShipmentDocument } from './entities/shipment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppGateway } from 'src/app.gateway';
import { OptionType, ShipmentOptionType } from '../order/entities/order.entity';
import { Frequency, UtilityService } from 'src/helpers/utils';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    private utilityService: UtilityService,
    private appGateway: AppGateway,
  ) {}

  async create(createShipmentDto: Shipment) {
    try {
      const newShipment = await new this.shipmentModel(
        createShipmentDto,
      ).save();
      return newShipment;
    } catch (e) {
      console.log('createShipment error ', e);
    }
  }

  async generateShipmentForOrder(shipment: Shipment) {
    shipment.estimatedDeliveryDate = new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000,
    );
    const newShipment = await this.create(shipment);
    await this.appGateway.emitEvent('newShipment', newShipment);
    console.log('Emmited--newShipment');
    return newShipment;
  }

  findAll() {
    return `This action returns all shipment`;
  }

  async findShipmentsByCountries(countries: string[]): Promise<Shipment[]> {
    return this.shipmentModel
      .find({
        destination: { $in: countries },
      })
      .exec();
  }

  async findShipmentsForAgent(
    countries: string[],
    page,
    limit: number,
    status: ShipmentOptionType,
  ) {
    const skip = (page - 1) * limit;
    const filter = {
      destination: { $in: countries },
      status,
    };
    console.log('FILTER::: ', filter);

    const data = await this.shipmentModel
      .find(filter)
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

  acceptShipment(shipmentID, agentID, status?: string) {
    const presentStatus = ShipmentOptionType[status];
    const newUpdate =
      presentStatus === ShipmentOptionType.PROCESSING
        ? { agentID, status: ShipmentOptionType.ACCEPTED }
        : presentStatus === ShipmentOptionType.IN_TRANSIT
          ? { status: ShipmentOptionType.WAREHOUSED }
          : presentStatus === ShipmentOptionType.WAREHOUSED
            ? { status: ShipmentOptionType.FOR_SHIPPING }
            : null;
    presentStatus === ShipmentOptionType.FOR_SHIPPING
      ? { status: ShipmentOptionType.SHIPPED }
      : null;

    return this.shipmentModel
      .findOneAndUpdate({ _id: shipmentID }, newUpdate, { new: true })
      .exec();
  }

  rejectShipment(shipmentID, agentID, reason?: string) {
    const newUpdate = {
      agentID,
      status: ShipmentOptionType.REJECTED,
      rejectReason: reason,
    };

    return this.shipmentModel
      .findOneAndUpdate({ _id: shipmentID }, newUpdate, { new: true })
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }

  async getAgentRecentShipments(
    vendorID: string,
    daysAgo: Frequency,
    page,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const { startDate, endDate } =
      this.utilityService.calculatePreviousDate(daysAgo);
    const filter = {
      agentID: vendorID,
      createdAt: { $gte: new Date(startDate) },
    };

    const res = await this.shipmentModel.aggregate([
      { $match: { deletedAt: null, createdAt: { $gte: new Date(startDate) } } },
      { $sort: { createdAt: -1 } },
      { $match: { agentID: vendorID } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await this.shipmentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .countDocuments();
    return {
      data: res,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMonthlyShipmentData(agentID, startDate, endDate) {
    console.log('DTO== ', agentID, startDate, endDate);
    const result = await this.shipmentModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null }, // Exclude deleted orders
        },
      },
      {
        $unwind: '$items', // Flatten the items array to access agentID
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }, // Group by month
            year: { $year: '$createdAt' }, // Include year for accurate grouping
            agentID: '$items.agentID',
            status: '$status', // Include order status for filtering successful orders
          },
          count: { $sum: 1 }, // Count the number of orders
        },
      },
      {
        $group: {
          _id: { month: '$\_id.month', year: '$_id.year' },
          totalOrdersByAgentID: {
            $push: {
              agentID: '$\_id.agentID',
              status: '$_id.status',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$\_id.month',
          year: '$_id.year',
          totalOrdersByAgentID: {
            $map: {
              input: '$totalOrdersByAgentID',
              as: 'agentData',
              in: {
                agentID: '$$agentData.agentID',
                count: '$$agentData.count',
                isSuccessful: {
                  $cond: [
                    { $eq: ['$$agentData.status', 'DELIVERED'] }, // Check for successful status
                    '$$agentData.count',
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          month: 1,
          year: 1,
          totalOrdersByAgentID: 1,
          totalSales: {
            $sum: {
              $map: {
                input: '$totalOrdersByAgentID',
                as: 'agentData',
                in: '$$agentData.isSuccessful',
              },
            },
          },
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    // Map months from numbers to names (optional)
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    console.log('REULTs=== ', result);

    return result.map((item) => ({
      month: `${monthNames[item.month - 1]} ${item.year}`,
      totalOrdersByAgentID: item.totalOrdersByAgentID,
      totalSales: item.totalSales,
    }));
  }

  async getShipmentsByMonth(agentID, startDate, endDate) {
    const shipments = await this.shipmentModel.aggregate([
      {
        $match: {
          agentID: agentID,
          updatedAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          status: { $in: ['DELIVERED', 'ACCEPTED'] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$updatedAt' },
            year: { $year: '$updatedAt' },
            status: '$status',
          },
          shipments: { $push: '$$ROOT' },
        },
      },
      {
        $group: {
          _id: { month: '$_id.month', year: '$_id.year' },
          delivered: {
            $push: {
              $cond: [{ $eq: ['$_id.status', 'DELIVERED'] }, '$shipments', []],
            },
          },
          accepted: {
            $push: {
              $cond: [{ $eq: ['$_id.status', 'ACCEPTED'] }, '$shipments', []],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          delivered: {
            $reduce: {
              input: '$delivered',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
          accepted: {
            $reduce: {
              input: '$accepted',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
        },
      },
      { $sort: { year: 1, month: 1 } }, // Sorting by year and month
    ]);

    return shipments;
  }

  async getShipmentCountsByMonth(
    agentID: string,
    startDate: string,
    endDate: string,
  ) {
    return this.shipmentModel.aggregate([
      {
        $match: {
          agentID: agentID,
          updatedAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          status: { $in: ['DELIVERED', 'ACCEPTED'] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$updatedAt' },
            year: { $year: '$updatedAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { month: '$_id.month', year: '$_id.year' },
          delivered: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'DELIVERED'] }, '$count', 0],
            },
          },
          accepted: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'ACCEPTED'] }, '$count', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          delivered: 1,
          accepted: 1,
        },
      },
      { $sort: { year: 1, month: 1 } }, // Sorting by year and month
    ]);
  }
}
