import {
  Controller,
  Req,
  Query,
  Get,
  Post,
  HttpStatus,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { Request } from 'express';
import { ChangePasswordDto, ResetPasswordDto } from '../auth/dto/reset.dto';
import { FileService } from 'src/helpers/upload';
import * as bcrypt from 'bcrypt';
import { OrderService } from '../order/order.service';

import { ApiTags } from '@nestjs/swagger';
import { ItemFilter, ItemStatus } from '../items/entities/item.entity';
import { ItemsService } from '../items/items.service';
import { OptionType } from '../order/entities/order.entity';
import { Frequency } from 'src/helpers/utils';
import { UpdateOrderDto } from '../order/dto/update-order.dto';

@ApiTags('vendors')
@Controller('vendors')
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly orderService: OrderService,
    private readonly itemsService: ItemsService,
    private readonly fileService: FileService,
  ) {}
  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Get('/details')
  findOne(@Req() req: Request) {
    try {
      const vendorID = req['user'].sub;
      const role = req['user'].role;

      if (role != 'vendor') {
        throw new BadRequestException('unaccessible to non-vendors');
      }

      return this.vendorService.findOne(vendorID);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get('/items')
  async searchItem(
    @Req() req: Request,
    @Query('query') searchWord: string,
    @Query('daysDifference') daysDifference: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('filter') filter?: ItemStatus,
  ) {
    const vendorID = req['user'].sub;
    const role = req['user'].role;

    page = Number(page);
    limit = Number(limit);

    if (!page) page = 1; // Page should be at least 1
    if (!limit || limit > 100) limit = 10; // Limit should be between 1 and 100

    return await this.itemsService.searchItemByVendors(
      searchWord.trim(),
      vendorID,
      daysDifference,
      page,
      limit,
      filter,
    );
  }

  // @Get('dashboard/customers')
  // async findNewCustomers(
  //   @Req() req: Request,
  //   @Query('startDate') startDate?: string,
  //   @Query('endDate') endDate?: string,
  // ) {
  //   try {

  //   const vendorID = req['user'].sub
  //   const role = req['user'].role

  //   if(role !="vendor"){
  //     throw new BadRequestException("unaccessible to non-vendors");
  //   }

  //   const resp = await this.orderService.getNewCustomers(vendorID,startDate,endDate);
  //   console.log("resp::::::> ",resp)
  //   return resp
  // } catch (e) {
  //   throw new BadRequestException(e);
  // }
  // }

  // @Get('/item-stats')
  // async getItemStats(
  //   @Req() req: Request,
  // )
  // {

  // const vendorID = req['user'].sub
  // const role = req['user'].role

  // return await this.itemsService.countItemsAndCategories(vendorID);
  // }

  // list all orders for a vendor use on the dasboard and orderSection
  @Get('/orders')
  async searchVendorOrder(
    @Req() req: Request,
    @Query('daysDifference') daysDifference: number,
    @Query('status') status: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1; // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10; // Limit should be between 1 and 100

    const vendorID = req['user'].sub;
    const role = req['user'].role;
    console.log('vendorID==vendorID', vendorID);
    return await this.orderService.findOrdersByVendorID(
      vendorID,
      daysDifference,
      page,
      limit,
    );
  }

  @Get('/vendor-orders')
  async listVendorOrders(
    @Req() req: Request,
    @Query('daysDifference') daysDifference: Frequency,
    @Query('status') status: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1; // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 50;

    const vendorID = req['user'].sub;
    const role = req['user'].role;
    console.log('vendorID==vendorID', vendorID);

    return await this.orderService.listVendorOrders(
      vendorID,
      daysDifference,
      page,
      limit,
      OptionType[status],
    );
  }

  // list all orders for a vendor use on the dasboard and orderSection
  @Get('/open-orders')
  async searchOpenOrder(
    @Req() req: Request,
    @Query('daysDifference') daysDifference: number,
  ) {
    const vendorID = req['user'].sub;
    const role = req['user'].role;

    return await this.orderService.findOpenOrdersForVendors(daysDifference);
  }

  // completedOrder
  @Patch('/complete-order')
  async completeProcessing(
    @Req() req: any,
    @Body() dto: { itemIDs: string[] },
    @Query('orderID') orderID: string,
  ) {
    try {
      const vendorID = req['user'].sub;
      const role = req['user'].role;

      if (role != 'vendor') {
        throw new BadRequestException('unaccessible to non-vendors');
      }
      return await this.orderService.completeProcessing(
        vendorID,
        orderID.trim(),
        dto.itemIDs,
      );
    } catch (e) {
      console.log('Error::: ', e);
    }
  }

  @Get('/best-sellers')
  async bestSellers(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('daysDifference') daysDifference: Frequency,
  ) {
    try {
      const vendorID = req['user'].sub;
      const role = req['user'].role;
      page = Number(page);
      limit = Number(limit);

      if (!page ) page = 1; // Page should be at least 1
      if (!limit  || limit > 100) limit = 10; // Limit should be between 1 and 100

      if (role != 'vendor') {
        throw new BadRequestException('unaccessible to non-vendors');
      }
      return await this.itemsService.getVendorBestSellers(
        vendorID,
        daysDifference,
        page,
        limit,
      );
    } catch (e) {
      console.log('Error::: ', e);
    }
  }
  @Get('/recent-orders')
  async recentOrders(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('daysDifference') daysDifference: Frequency,
  ) {
    try {
      const vendorID = req['user'].sub;
      const role = req['user'].role;
      page = Number(page);
      limit = Number(limit);

      if (!page) page = 1; // Page should be at least 1
      if (!limit  || limit > 100) limit = 10; // Limit should be between 1 and 100

      if (role != 'vendor') {
        throw new BadRequestException('unaccessible to non-vendors');
      }

      return await this.orderService.getVendorRecentOrders(
        vendorID,
        daysDifference,
        page,
        limit,
      );
    } catch (e) {
      console.log('Error::: ', e);
    }
  }

  @Patch('')
  async update(@Body() updateVendorDto: UpdateVendorDto, @Req() req: Request) {
    const role = req['user'].role;
    if (role != 'vendor') {
      throw new BadRequestException('unaccessible to non-vendors');
    }
    updateVendorDto.email = undefined;
    updateVendorDto.password = undefined;

    console.log('updateVendorDt==== ', updateVendorDto);

    const vendorID = req['user'].sub;
    const vPath = 'public/images/vendors';
    const vidPath = 'public/videos/vendors';

    const imageName = `${vendorID}.png`;
    if (updateVendorDto.profilePicture) {
      const imagePath = `${vPath}/profilePicture`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.profilePicture,
        imagePath,
        imageName,
      );
      updateVendorDto.profilePicture = `${imagePath}/${imageName}`;
    }

    if (updateVendorDto.businessPicture) {
      const imagePath = `${vPath}/business`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.businessPicture,
        imagePath,
        imageName,
      );
      updateVendorDto.businessPicture = `${imagePath}/${imageName}`;
    }

    if (updateVendorDto.permitDocument) {
      const imagePath = `${vPath}/vendorPermit`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.permitDocument,
        imagePath,
        imageName,
      );
      updateVendorDto.permitDocument = `${imagePath}/${imageName}`;
    }
    if (updateVendorDto.nafdacRegistration) {
      const imagePath = `${vPath}/nafdacRegistration`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.nafdacRegistration,
        imagePath,
        imageName,
      );
      updateVendorDto.nafdacRegistration = `${imagePath}/${imageName}`;
    }
    if (updateVendorDto.cacDocument) {
      const imagePath = `${vPath}/CAC`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.cacDocument,
        imagePath,
        imageName,
      );
      updateVendorDto.cacDocument = `${imagePath}/${imageName}`;
    }
    if (updateVendorDto.idDocumentFront) {
      const imageName = `${vendorID}_front.png`;

      const imagePath = `${vPath}/ID`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.idDocumentFront,
        imagePath,
        imageName,
      );
      updateVendorDto.idDocumentFront = `${imagePath}/${imageName}`;
    }
    if (updateVendorDto.idDocumentBack) {
      const imageName = `${vendorID}_back.png`;

      const imagePath = `${vPath}/ID`;
      const success = await this.fileService.uploadImage(
        updateVendorDto.idDocumentBack,
        imagePath,
        imageName,
      );
      updateVendorDto.idDocumentBack = `${imagePath}/${imageName}`;
    }
    if (updateVendorDto.processVideo) {
      const videoName = `${vendorID}.mp4`;

      const videoPath = `${vidPath}/processVideo`;
      const success = await this.fileService.uploadVideo(
        updateVendorDto.processVideo,
        videoPath,
        videoName,
      );
      updateVendorDto.processVideo = `${videoPath}/${videoName}`;
    }

    try {
      return await this.vendorService.update(vendorID, updateVendorDto);
    } catch (e) {
      console.log('ERROR==', e);
      throw new BadRequestException(e);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    const userID = req['user'].sub;
    dto.vendorID = userID;
    return await this.vendorService.resetVendorPassword(dto);
  }

  @Patch('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() updateUserDto: ChangePasswordDto,
  ) {
    const vendorID = req['user'].sub;

    const passwordHarsh = await this.vendorService.hashData(
      updateUserDto.newPassword,
    );
    const where = { vendorID };
    let user = await this.vendorService.findWhere(where);

    const matches = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!matches) {
      throw new BadRequestException("old password don't match");
    }

    user.password = passwordHarsh;

    return await this.vendorService.update(vendorID, user);
  }

  @Get('/dashboard')
  async getStatsOrder(
    @Req() req: Request,
    @Query('daysDifference') daysDifference: Frequency,
  ) {
    try {
      const vendorID = req['user'].sub;
      const role = req['user'].role;
      return await Promise.all([
        await this.itemsService.countItemsAndCategories(
          vendorID,
          daysDifference,
        ),
        await this.orderService.getNewCustomers(vendorID, daysDifference),
        await this.orderService.countOrdersByVendorID(vendorID, daysDifference),
      ]);
    } catch (e) {
      console.log('Error:: ', e);
    }
  }
}
