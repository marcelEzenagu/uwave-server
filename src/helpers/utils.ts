import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  
  // Method to calculate the past date based on the range
  calculatePreviousDate(range: 'weekly' | 'fortnightly' | 'quarterly' | 'annually'):{startDate:string ,endDate:string} {
    const endDate = new Date();  // Use the current date as the starting point
    const startDate = new Date();  // Use the current date as the starting point
    
    switch (range) {
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7); // Subtract 7 days for weekly
        break;

      case 'fortnightly':
        startDate.setDate(startDate.getDate() - 14); // Subtract 14 days for fortnightly
        break;

      case 'quarterly':
        startDate.setMonth(startDate.getMonth() - 3); // Subtract 3 months for quarterly
        break;

      case 'annually':
        startDate.setFullYear(startDate.getFullYear() - 1); // Subtract 1 year for annually
        break;

      default:
        throw new Error('Invalid range provided');
    }

    return {startDate: startDate.toISOString(),
      endDate:endDate.toISOString()
    };
  }

}
