import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  Item,
  ItemDocument,
  ItemFilter,
  ItemStatus,
} from './entities/item.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from 'src/helpers/upload';
import { AuthService } from '../auth/auth.service';

import { ErrorFormat } from 'src/helpers/errorFormat';
import { Frequency,UtilityService } from 'src/helpers/utils';
@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,

    private readonly fileService: FileService,
    private errorFormat: ErrorFormat,
    private utilityService: UtilityService,
  ) {}

  async create(createItemDto: Item) {
    try {
      // const activeItem = await this.itemModel.findOne({ itemName: createItemDto.itemName, vendorID: createItemDto.vendorID, deletedAt: null });
      // if(!activeItem){
      if (createItemDto.images) {
        const vPath = 'public/images/items';
        const productImages: string[] = [];
        const imagePath = `${vPath}/${createItemDto.vendorID}/${createItemDto.itemName}`;
        for (let i = 0; i < createItemDto.images.length; i++) {
          const imageName = `${createItemDto.itemName}-${i}.png`;
          await this.fileService.uploadImage(
            createItemDto.images[i],
            imagePath,
            imageName,
          );
// console.log("imagePath",imagePath)
const itemImage = `${imagePath}/${imageName}`;
          productImages.push(itemImage);
        }

        createItemDto.images = productImages;
      }

      let newProduct = new this.itemModel(createItemDto);
      return await newProduct.save();

      // }else{
      //   return activeItem
      // }
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async decreaseItem(items: Item[]) {
    try {
      const updatedItems: Item[] = [];

      for (const {itemName,quantity} of items) {
        const updatedItem = await this.itemModel.findOneAndUpdate(
          { itemName:itemName, quantity: { $gte: quantity } }, // Ensure sufficient stock is available
          { $inc: { quantity: -quantity, salesCount: +quantity } }, // Atomically decrement the quantity
          { new: true },
        );

        if (!updatedItem) {
          throw new Error('Not enough quantity available.');
        }
        updatedItems.push(updatedItem);
      }
      return updatedItems;
    } catch (e) {
      throw e;
    }
  }

  async findAll(where: any) {
    const { page, limit,itemCategory,itemSubCategory,country } = where;
    const skip = (page - 1) * limit;
    const filter: any = {
      deletedAt: null,
      status: ItemStatus.ACTIVE,
    };

    if (itemCategory != "undefined") {
      filter.itemCategory = {
        $regex: new RegExp(`^${itemCategory}`, 'i'),
      };
    }
    if (itemSubCategory != "undefined") {
      console.log("HERE::", itemSubCategory)
      filter.itemSubCategory = {
        $regex: new RegExp(`^${itemSubCategory}`, 'i'),
      };
    }
    if (country != "undefined") {
      filter.itemSupportedCountries = {
        $regex: new RegExp(`^${country}`, 'i'),
      };
    }

    console.log("FILTER::: ",filter)

    try {
      const data = await this.itemModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.itemModel.countDocuments();
      return {
        data,
        total,
        currentPage: page,
      };
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async adminFindAll(where: any) {
    try {
      return await this.itemModel.find().where(where).exec();
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async searchItem(page, limit, query, country, filterTag: string) {
    try {
      const skip = (page - 1) * limit;

      const filter: any = {
        deletedAt: null,
        status: ItemStatus.ACTIVE,
      };

      if (query!= "undefined") {
        query = query.trim();

        filter.$text = { $search: query };
      }

      if (country != "undefined") {
        filter.itemSupportedCountries = {
          $regex: new RegExp(`^${country}`, 'i'),
        };
      }

      var sortOption: any = {};
      if (filterTag == ItemFilter.BEST_SELLER) {
        sortOption.salesCount = -1; // Sort bestsellers first
      } else if (filterTag == ItemFilter.HIGH_TO_LOW) {
        sortOption.salesPrice = -1; // Sort by price high to low
      } else if (filterTag == ItemFilter.LOW_TO_HIGH) {
        sortOption.salesPrice = 1; // Sort by price low to high
      }

      const data = await this.itemModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .exec();

      const total = await this.itemModel.countDocuments();
      return {
        data,
        total,
        currentPage: page,
      };
    } catch (e) {
      console.log('Error:: ', e);
      throw new Error(e);
    }
  }

  async adminSearchItem(query, country, filterTag: string) {
    query = query.trim();

    const filter: any = {
      $text: { $search: query },
      itemSupportedCountries: { $regex: new RegExp(`^${country}`, 'i') },
    };

    var sortOption: any = {};
    if (filterTag == ItemFilter.BEST_SELLER) {
      sortOption.salesCount = -1; // Sort bestsellers first
    } else if (filterTag == ItemFilter.HIGH_TO_LOW) {
      sortOption.salesPrice = -1; // Sort by price high to low
    } else if (filterTag == ItemFilter.LOW_TO_HIGH) {
      sortOption.salesPrice = 1; // Sort by price low to high
    }

    return await this.itemModel.find(filter).sort(sortOption).exec();
  }

  async searchItemByVendors(
    query,
    vendorID: string,
    daysDifference,
    page,
    limit: number,
    status?: ItemStatus,
  ) {
    query = query.trim();
    const skip = (page - 1) * limit;

    const endDate = new Date(); // Current date
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysDifference);

    const filter: any = {
      $text: { $search: query },
      vendorID,
      createdAt: {
        $lte: endDate, // greater than or equal to startDate
        $gte: startDate, // less than or equal to endDate
      },
    };
    if (status) {
      filter.status = status;
    }

    var sortOption: any = {};
    const data = await this.itemModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.itemModel.countDocuments(filter);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async countItemByVendors(
    vendorID: string,
    daysDifference,
    page,
    limit: number,
    daysAgo: Frequency,
  ) {
    const {startDate,endDate} = this.utilityService.calculatePreviousDate(daysAgo)


    const filter: any = {
      vendorID,
      createdAt: {
        $lte: endDate, // greater than or equal to startDate
        $gte: startDate, // less than or equal to endDate
      },
    };
   

    var sortOption: any = {};
    const data = await this.itemModel
      .find(filter)
      .sort(sortOption)
      .limit(limit)
      .exec();
    const total = await this.itemModel.countDocuments();

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async adminListItemByVendors(
    vendorID: string,
    page,
    limit: number,
    status?: string,
  ) {
    const skip = (page - 1) * limit;

    const filter: any = { vendorID };
    if (status) {
      filter.status = ItemStatus[status];
    }else{
      filter.status = {$in:[ItemStatus.ACTIVE,ItemStatus.DRAFT,ItemStatus.INACTIVE]}

    }
    var sortOption: any = {};
    const data = await this.itemModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.itemModel.find(filter)
    .countDocuments();

    return {
      data,
      total,
      currentPage: page,
      // totalPages: Math.ceil(total / limit),
    };
  }

  async adminListNewItemByVendors(
    vendorID: string,
    page,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const filter: any = {
                          status:ItemStatus.ACTIVE,
                          isApproved:!true
                         };
  

                         if(vendorID){
                            filter.vendorID= vendorID
                         }


    const data = await this.itemModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.itemModel.countDocuments();

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async adminSearchItemByVendors(
    query,
    vendorID: string,
    page,
    limit: number,
    status?: ItemStatus,
  ) {
    query = query.trim();
    const skip = (page - 1) * limit;

    // const endDate = new Date(); // Current date
    // const startDate = new Date();
    // startDate.setDate(endDate.getDate() - daysDifference);

    const filter: any = { $text: { $search: query }, vendorID };
    if (status) {
      filter.status = status;
    }

    var sortOption: any = {};
    const data = await this.itemModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.itemModel.countDocuments();

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Item> {
    try {
      return await this.itemModel.findById(id).exec();
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async findWhere(where: any): Promise<Item> {
    where.status = ItemStatus.ACTIVE;
    where.deletedAt = null;

    try {
      return await this.itemModel.findOne().where(where).exec();
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    try {
      return await this.itemModel.findByIdAndUpdate(id, updateItemDto, {
        new: true,
      });
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async approveItem(id: string, ) {
    try {
      const updateItemDto: UpdateItemDto={}

      updateItemDto.isApproved = true
      return await this.itemModel.findByIdAndUpdate(id, updateItemDto, {
        new: true,
      });
    } catch (e) {
      console.log('error:: ', e);
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  async remove(id: string) {
    const filter = { deletedAt: null, _id: id };
    const updateProductDto = { deletedAt: new Date() };
    await this.itemModel.findOneAndUpdate(filter, updateProductDto, {
      new: true,
    });

    return `This action removes a #${id} item`;
  }

  async delete(vendorID, id: string) {
    const filter = { vendorID: vendorID, _id: id };
    await this.itemModel.findOneAndDelete(filter).exec();
    return `This action removes a #${id} item`;
  }

  async countItemsAndCategories(
    vendorID: string,daysAgo:Frequency
  ): Promise<{ totalItems: number; totalSections: number }> {
 
    const {startDate,endDate} = this.utilityService.calculatePreviousDate(daysAgo)
  
    

 
    const result = await this.itemModel.aggregate([
      { $match: { vendorID ,
        status:ItemStatus.ACTIVE,
        createdAt: { $gte: new Date(startDate),
          $lte: new Date(endDate) 
        }
      }

       },

      // Group to get distinct itemCategories and count total items
      {
        $group: {
          _id: null, // We are grouping everything together
          totalItems: { $sum: 1 }, // Count total items
          totalSections: { $addToSet: '$itemCategory' }, // Collect distinct categories
        },
      },

      // Project to format the result (count distinct categories)
      {
        $project: {
          _id: 0, // Exclude _id
          totalItems: 1, // Keep totalItems
          totalSections: { $size: '$totalSections' }, // Count the distinct categories
        },
      },
    ]);

    // If no result, return defaults
    if (result.length > 0) {
      return result[0];
    } else {
      return { totalItems: 0, totalSections: 0 };
    }
  }

  async countVendorSection(vendorID:string,daysAgo:Frequency){
    const {startDate,endDate} = this.utilityService.calculatePreviousDate(daysAgo)
    return await this.itemModel.aggregate([
      { $match: { vendorID,
      createdAt: { $gte: new Date(startDate) },  // Only include orders from the last 7 days
      }
    },
      { $group: { _id: "$itemCategory" } },
      { $count: "vendorSectionCount" }
    ]);
  }
  
}
