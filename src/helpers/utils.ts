import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  
  // Method to calculate the past date based on the range
  calculatePreviousDate(range: 'weekly' | 'fortnightly' | 'quarterly' | 'annually'): Date {
    const resultDate = new Date();  // Use the current date as the starting point
    
    switch (range) {
      case 'weekly':
        resultDate.setDate(resultDate.getDate() - 7); // Subtract 7 days for weekly
        break;

      case 'fortnightly':
        resultDate.setDate(resultDate.getDate() - 14); // Subtract 14 days for fortnightly
        break;

      case 'quarterly':
        resultDate.setMonth(resultDate.getMonth() - 3); // Subtract 3 months for quarterly
        break;

      case 'annually':
        resultDate.setFullYear(resultDate.getFullYear() - 1); // Subtract 1 year for annually
        break;

      default:
        throw new Error('Invalid range provided');
    }

    return resultDate;
  }
}
