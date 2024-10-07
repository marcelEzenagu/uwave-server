import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorFormat  {
  formatErrors(error: any) {
    console.log("error.name:: ",error.name)

    if(error.name === 'MongoServerError'){
    const field = Object.keys(error.keyPattern)[0];
      return `a document with same ${field} already exists`;

    }else{
      const formattedErrors = [];
      if(error.errors != undefined){
        for (const key in error.errors) {
        if (error.errors.hasOwnProperty(key)) {
          formattedErrors.push({
            field: key,
            message: error.errors[key].message,
          });
        }
        
        
        }
      }else{
        formattedErrors.push(error.message)
      }
      return formattedErrors;

    }

  }
}


