import { Injectable } from '@nestjs/common';

export type Frequency = '7 days ago' | 'a fortnight ago' | 'a month ago' | 'a year ago';

@Injectable()
export class UtilityService {
  
  // Method to calculate the past date based on the range
  calculatePreviousDate(range: Frequency):{startDate:string ,endDate:string} {
    const endDate = new Date();  // Use the current date as the starting point
    const startDate = new Date();  // Use the current date as the starting point
    
    switch (range) {
      case '7 days ago':
        startDate.setDate(startDate.getDate() - 7); // Subtract 7 days for weekly
        break;

      case 'a fortnight ago':
        startDate.setDate(startDate.getDate() - 14); // Subtract 14 days for fortnightly
        break;

      case 'a month ago':
        startDate.setMonth(startDate.getMonth() - 1); // Subtract 3 months for quarterly
        break;

      // case 'quarterly':
      //   startDate.setMonth(startDate.getMonth() - 3); // Subtract 3 months for quarterly
      //   break;

      case 'a year ago':
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
