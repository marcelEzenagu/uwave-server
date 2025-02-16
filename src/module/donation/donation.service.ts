import { Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { Donation, DonationDocument } from './entities/donation.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripePayment } from 'src/helpers/stripePayment';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private readonly stripeService: StripePayment,
  ) {}
  async create(createDonationDto: Donation) {
    await new this.donationModel(createDonationDto).save();

    createDonationDto.paymentIntentID = undefined;
    return createDonationDto;
  }

  async confirmDonation(dto: {}) {}

  async findAll(page: number, limit: number, where: any) {
    const skip = (page - 1) * limit;

    const { startDate, endDate } = where;

    const filter: any = {
      createdAt: {
        $lte: endDate, // greater than or equal to startDate
        $gte: startDate, // less than or equal to endDate
      },
    };

    const data = await this.donationModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.donationModel.countDocuments(filter);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} donation`;
  }

  update(id: number, updateDonationDto: UpdateDonationDto) {
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
