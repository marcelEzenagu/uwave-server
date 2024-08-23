// unique-validator.ts
export class ErrorFormat  {
  formatErrors(error: any) {
    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
       return `Duplicate value for field: ${field}`;
     }else{
       const formattedErrors = [];
       for (const key in error.errors) {
         if (error.errors.hasOwnProperty(key)) {
           formattedErrors.push({
             field: key,
             message: error.errors[key].message,
           });
         }
       }
       return formattedErrors;
     }
 
   }
}


