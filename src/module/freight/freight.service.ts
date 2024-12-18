import { Injectable } from '@nestjs/common';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { Freight,FreightDocument } from './entities/freight.entity';


@Injectable()
export class FreightService {
  constructor(
    @InjectModel(Freight.name) private freightModel: Model<FreightDocument>
    ) {}

  async create(createFreightDto: CreateFreightDto) {

  try{

    const newSavedItem = new this.freightModel(createFreightDto);
    return await newSavedItem.save();
   }catch(e){
    console.log("ERROR:: ",e)
    throw e
      }
  
  }

  async findAll(where:any) {
    where.deletedAt = null
    return await  this.freightModel.find().where(where).exec();
  }

  async adminFindAll() {
    return await this.freightModel.find().exec();
  }

  async findOne(userID,id: string) {
    const where = {"userID":userID,"_id":id}
    return await  this.freightModel.findOne().where(where).exec();
  }

  async update(id: string, updateFreightDto: UpdateFreightDto) {
    return await  this.freightModel.findByIdAndUpdate(id, updateFreightDto, {new: true})
  }

  async adminUpdate(id: string, UpdateFreightDto: UpdateFreightDto) {

    try{

    console.log("paymentStatus:::: ",UpdateFreightDto,id)
    const where = {
      _id:id
    }
    return await this.freightModel.findOneAndUpdate(where,UpdateFreightDto,{new:true})
  }catch(e){
    console.log("ERROR:: ",e)
    throw new Error(e)
  }
  }

  // // load receipt
  // async loadPdf(data){
  //   console.log("DATA===",data)

  //   const browser = await puppeteer.launch({
  //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //     // headless: ,
  //   });
  //   const page = await browser.newPage();
  //   let  buildPaths = await this.makeBuildPath(data.userID)
  //   const html = await this.createHtml(data);

  //   if(this.ensureDirectoryExistence(buildPaths.buildPathHtml)){
  //     fs.writeFileSync(
  //       buildPaths.buildPathHtml,
  //       html, (err => {
  //         if (err) {
  //           throw err;
  //         } else return "HTML generated";
  //       })
  //     )
  //   }
    
  //   if(this.ensureDirectoryExistence(buildPaths.buildPathPdf)){
  //     fs.writeFileSync(
  //       buildPaths.buildPathPdf,
  //       "",
  //       (err =>{
  //         if (err) {
  //           throw err;
  //         }
  //       })
  //       return {buildPaths:buildPaths }  
  //     )  
      
  //   }
  // }
 
  // async makeBuildPath(userPhone){

  //   let  buildPaths = {
  //      buildPathHtml: path.resolve(__dirname, `../public/bank-statement/html/${userPhone}_statement.html`),
  //      buildPathPdf: path.resolve(__dirname, `../public/bank-statement/pdf/${userPhone}_statement.pdf`),
  //    };
   
  //    return buildPaths 
  //  }

  //  async ensureDirectoryExistence(filePath) {
  //   var dirname = path.dirname(filePath);
  //   if (fs.existsSync(dirname)) {
  //     return true;
  //   }
  //   this.ensureDirectoryExistence(dirname);
  //   fs.mkdirSync(dirname);
  // }

  // async createHtml (data){ 
    
  //   const htmlData = `<html>
  //   <head>
  //     <style>
  //     *{
  //       color:"#15141f"
  //     }
  //       table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin-top:2px;
  //       }
  //       thead{
  //         display: table-header-group;

  //       }
  //       th {
  //         background-color: #2b1a64;
  //         color:white;
  //         padding:10px 0px 10px 0px;
  //         font-size:9px
  //       }
  //       tr {
  //         text-align: center;
          
  //       }
        
  //        td {
  //         padding: 5px;
  //         width:60;
  //       }
  
  //       #smallFont{
  //         font-size:14;
  //         font-weight:500
  //       }
  
  //       #thFont{
  //         font-size:10;
  //         font-weight:bold
  
  //       }
        
  //       #headerRight {
  //         display: flex; 
  //         justify-content: flex-end;
  //         align-items:center;
  //           }
  //       .header_div{
  //         display:flex;
  //         justify-content:space-between;
  //         align-items:center;
  //         color:#804b34;
  //       }
  //       img{width:25%}
  //       #user{
  //         font-size:18;
  //       }
  //       #statement{
  //         border-bottom: 1px solid #804b34!important;
  //         font-size:20px;
  //         text-align:center;
  //         margin:20px 0px
  //       }
  //       .credit{
  //         color:green;
  //       }
  //       .debit{
  //         color:red;
  //       }
  //       #summary{
  //         display:flex;
  //         align-items:flex-start;
  //       }
  //       #summary span {
  //         padding-left:20px;
  //       }
  //       #spanDiv{
  //         display:flex; 
  //         flex-direction:column;
  //         margin-bottom:10px
  //       }
  //       #t_head {
  //         background-color: #2b1a64;
  //         color:white;
  //         padding:10px 10px 10px 10px;
  //         font-size:9px
  //       }
  
       
  //     </style>
  //   </head>
  //   <body style="" >
  //   <header style="padding:0px 20px 0px 20px;" >
  //   <div id="headerLeft">
  //       <img style="width:5%; height:10%"
  //       src="../../../../public/bank-statement/assets/logo.jpg" alt="homeTown logo" />
  //       <p style="display:flex">
  //         <span style="font-weight:bold; font-size:20px; color:#ff6600">Home</span> 
  //         <span style="font-weight:bold; font-size:20px; color:#2b1a64">town</span> 
  //       </p>
  
  //   </div>
  
  //   <div id="headerRight" style="font-size:30px; font-weight:bold; color:#ff6600">
  //     UWave Logistics
  //   </div>
  //   <div classname="header_div" style="display: flex;justify-content:space-between; align-items:flex-start;" >
  //       <div>
  //           <div style="border:2px solid #ff6600; padding:5px 3px 5px 3px; " >
  //             <span >16 Nandi Lane , Ranui </span>
  //             </br>
  //             <span >Auckland 0612</span>
  //             </br>
  //             <span >
  //               <strong>Tel:
  //               </strong>
  //               +642904307658 
  //             </span>
  //             </br>
  //           </div>
           
  //       </div>
  
  
  //       <div>
  //           <div id="spanDiv" >
  //               <span id="smallFont">TRACKING ID:</span>
  //               <strong id="user">${data.id}</strong>
  //           </div>
  //           <div id="spanDiv">
  //               <span id="smallFont">DROPPED:</span>
  //               <strong id="user">${moment(data.dateDropped).format(' MMMM Do YYYY').toUpperCase()}</strong>
  //           </div>
            
  //       </div>
  //   </div>
  //   </div>
  
  
  
  
  //   </body> 
  // </header> 
  //   </body>
  // </html>`;
    
  // return htmlData
    
  // }

}
