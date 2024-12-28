import { Controller, Get,Query, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationService } from './donation.service';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { Donation } from './entities/donation.entity';
import { Frequency, UtilityService } from 'src/helpers/utils';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService,

        private utils: UtilityService,
    
  ) {}

  @Post()
  create(@Body() createDonationDto: Donation) {
    return this.donationService.create(createDonationDto);
  }

  @Post("/confirm")
  confirmDonation(@Body() dto: Donation) {
    return this.donationService.confirmDonation(dto);
  }

  @Get()
  findAll(  
    @Query('daysDifference') daysDifference: Frequency,

    @Query('start') start: string, 
    @Query('stop') stop:string, 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50 
    ) {
      let where :any = {}
      if(start && stop ){
        where.stop =stop
        where.start =start
      }else if(daysDifference){

       const {startDate, endDate} =  this.utils.calculatePreviousDate(daysDifference)
       where.stop =endDate
       where.start =startDate
      }
  
      page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
      return this.donationService.findAll(page,limit,where);

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationService.findOne(+id);
  }

}
