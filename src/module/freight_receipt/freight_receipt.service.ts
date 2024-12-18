import { Injectable,StreamableFile } from '@nestjs/common';
import { CreateFreightReceiptDto } from './dto/create-freight_receipt.dto';
import { UpdateFreightReceiptDto } from './dto/update-freight_receipt.dto';
import { FreightReceipt, FreightReceiptDocument } from './entities/freight_receipt.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';
import { Readable } from 'stream';
// import { Buffer } from 'buffer';
@Injectable()
export class FreightReceiptService {

  constructor(
    @InjectModel(
      FreightReceipt.name) private freightReceiptModel: Model<FreightReceiptDocument>
    ){}
    
 


  async adminCreate(createFreightDto: FreightReceipt){

    try{
  
      const newSavedItem = await new this.freightReceiptModel(createFreightDto).save()
  
     const resp =  await this.loadPdf(newSavedItem)
     return resp
      }catch(e){
        console.log("ERROR-creating pdf:: ",e)
        throw e
      }
    
    }



  // // load receipt
  async loadPdf(data) {
    try {
      let  buildPaths = await this.makeBuildPath(data.customerName)
      const html = await this.createHtml(data);

     if(this.ensureDirectoryExistence(buildPaths.buildPathHtml)){
        fs.writeFileSync(
          buildPaths.buildPathHtml,
          html,"utf-8"
        )
      }
      
      if(this.ensureDirectoryExistence(buildPaths.buildPathPdf)){
        
        fs.writeFileSync(
          buildPaths.buildPathPdf,
          ""
        )
     }
      // Step 2: Generate PDF from the saved HTML file
      const browser = await puppeteer.launch({ headless: "new" });
      console.log("HTML CREATED YET")

      // return
      const page = await browser.newPage();
      const fileUrl = 'file://' + buildPaths.buildPathHtml;

      if (!fs.existsSync(buildPaths.buildPathPdf)) {
        console.log("NO PDF YET")
        fs.mkdirSync(buildPaths.buildPathPdf);
      }
     
      await page.goto(fileUrl, 
        { waitUntil: 'networkidle2',
        timeout:0,
      },
        );


      const options = {
        margin: {
          // top: "20px",
          // right: "20px",
          bottom: "30px",
          // left: "20px",
        },
        path:buildPaths.buildPathPdf,
        printBackground: true,
        timeout:0,
      }

      await page.pdf(options);
      await browser.close();

      return buildPaths.buildPathPdf;
    } catch (e) {
      console.log('error loading pdf:', e);
    }
  }
 
  async makeBuildPath(userPhone){

    const rootDir = process.cwd();
    let  buildPaths = {
       buildPathHtml: path.resolve(rootDir, `public/receipt/html/${userPhone}receipt.html`),
       buildPathPdf: path.resolve(rootDir, `public/receipt/pdf/${userPhone}receipt.pdf`),
     };
   
     return buildPaths 
   }

   async ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  async createHtml (data){ 
    
    const htmlData = `<html>
    <head>
      <style>
      *{
        color:"#15141f"
      }
        
        #smallFont{
          font-size:14;
          font-weight:500
        }
        
        #headerRight {
          display: flex; 
          flex-direction:column;
          width:30%;
            }
        .header_div{
          display:flex;
          justify-content:space-between;
          align-items:center;
          color:#804b34;
        }
        img{width:25%}
        #user{
          font-size:18;
        }
        #statement{
          border-bottom: 1px solid #804b34!important;
          font-size:20px;
          text-align:center;
          margin:20px 0px
        }
        .credit{
          color:green;
        }
        .debit{
          color:red;
        }
        #summary{
          display:flex;
          align-items:flex-start;
        }
        #summary span {
          padding-left:20px;
        }
        #spanDiv{
          display:flex; 
          flex-direction:column;
          margin-bottom:10px
        }
      .centered-div {
      width: 50%; 
      margin: 0 auto;
      color: gray;
      padding: 20px;
      text-align: center;
    }
      </style>
    </head>
    <body style="" >
    <header style="padding:0px 20px 0px 20px;display:flex; justify-content:space-between;align-items:center" >
      <div id="headerLeft">
        <img style="width:60%; height:60%"
          src="../../../public/images/c_light.jpeg" alt="UWave logo" />
      </div>
  
      <div id="headerRight" >
        <div  style="font-size:20px; font-weight:bold">
          UWave Logistics
        </div>
        <div style="font-size:12px;"  >
          <span >16 Nandi Lane , Ranui </span>
          </br>
          <span >Auckland 0612</span>
          </br>
          <span >
            <strong>Tel:
            </strong>
            +642904307658 
          </span>
          </br>
        </div>
      </div>
  </header> 

    <section  >
        <div style="padding:20px 0 0 20px;margin" class="centered-div" >
          <span id="smallFont">TRACKING NUMBER:</span>
          <strong id="user">${data.id}</strong>
          </div>
          
          </br>

          <div id="spanDiv">
          <span id="smallFont">DROPPED DATE:
            <strong id="user">${data.dateDropped}</strong>
          </span>
        </div>
            
    </section>
    </body>
  </html>`;
    
  return htmlData
    
  }

}
