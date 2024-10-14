import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { UserType, Wallet, WalletDocument } from './entities/wallet.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly WalletModel: Model<WalletDocument>,
  ) {}

  async create(createWalletDto: CreateWalletDto) {}

  async initiateUserPayment(createWalletDto: Wallet) {
    createWalletDto.userType = UserType.USER;

    const newWallet = new this.WalletModel(createWalletDto);
    return await newWallet.save();
  }

  async initiateVendorPayment(createWalletDto: Wallet) {
    createWalletDto.userType = UserType.VENDOR;

    const newWallet = new this.WalletModel(createWalletDto);
    return await newWallet.save();
  }

  async initiateAgentPayment(createWalletDto: Wallet) {
    createWalletDto.userType = UserType.AGENT;

    const newWallet = new this.WalletModel(createWalletDto);
    return await newWallet.save();
  }

  async completeAgentPayment(createWalletDto: Wallet) {}

  async completeUserPayment(createWalletDto: Wallet) {}
  async completeVendorPayment(createWalletDto: Wallet) {}

  async findAll() {
    return `This action returns all wallet`;
  }

  async findAllWhere(where: any, start, end, page, limit, search: string) {
    search = search.trim();
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (start || end) {
      const startDate = new Date(start); // Start of the range
      const endDate = new Date(end); // End of the range

      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = startDate; // Filter by start date
      }
      if (endDate) {
        filter.createdAt.$lte = endDate; // Filter by end date
      }
    }

    const data = await this.WalletModel.find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.WalletModel.countDocuments();

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
