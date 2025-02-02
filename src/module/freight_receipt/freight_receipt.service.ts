import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateFreightReceiptDto } from './dto/create-freight_receipt.dto';
import { UpdateFreightReceiptDto } from './dto/update-freight_receipt.dto';
import {
  FreightReceipt,
  FreightReceiptDocument,
} from './entities/freight_receipt.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';
import { Readable } from 'stream';
// import { Buffer } from 'buffer';
@Injectable()
export class FreightReceiptService {
  constructor(
    @InjectModel(FreightReceipt.name)
    private freightReceiptModel: Model<FreightReceiptDocument>,
  ) {}

  async adminCreate(createFreightDto: FreightReceipt) {
    try {
      const newSavedItem = await new this.freightReceiptModel(
        createFreightDto,
      ).save();

      const resp = await this.loadPdf(newSavedItem);
      console.log('RESP  ');
      return resp;
    } catch (e) {
      console.log('ERROR-creating pdf:: ', e);
      throw e;
    }
  }

  // // load receipt
  async loadPdf(data) {
    try {
      let buildPaths = await this.makeBuildPath(data.customerName);

      const html = await this.createHtml(data);

      if (this.ensureDirectoryExistence(buildPaths.buildPathHtml)) {
        fs.writeFileSync(buildPaths.buildPathHtml, html, 'utf-8');
      }

      if (this.ensureDirectoryExistence(buildPaths.buildPathPdf)) {
        fs.writeFileSync(buildPaths.buildPathPdf, '');
      }
      // Step 2: Generate PDF from the saved HTML file
      const browser = await puppeteer.launch({ headless: 'new' });
      console.log('HTML CREATED YET');

      // return
      const page = await browser.newPage();
      const fileUrl = 'file://' + buildPaths.buildPathHtml;

      if (!fs.existsSync(buildPaths.buildPathPdf)) {
        console.log('NO PDF YET');
        fs.mkdirSync(buildPaths.buildPathPdf);
      }

      await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 0 });

      const options = {
        margin: {
          // top: "20px",
          // right: "20px",
          bottom: '30px',
          // left: "20px",
        },
        path: buildPaths.buildPathPdf,
        printBackground: true,
        timeout: 0,
      };

      await page.pdf(options);
      await browser.close();

      return buildPaths.buildPathPdf;
    } catch (e) {
      console.log('error loading pdf:', e);
    }
  }

  async makeBuildPath(userPhone) {
    const rootDir = process.cwd();
    let buildPaths = {
      buildPathHtml: path.resolve(
        rootDir,
        `public/receipt/html/${userPhone}receipt.html`,
      ),
      buildPathPdf: path.resolve(
        rootDir,
        `public/receipt/pdf/${userPhone}receipt.pdf`,
      ),
    };

    return buildPaths;
  }

  async ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  async createHtml(data) {
    const htmlData = `<html>
    <head>
      <style>
      *{
        color:"#15141f"
      }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      width: 80%; /* Adjust the width of the grid */
      margin: 0px auto; /* Center the grid */
    }
    .grid-2-container {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      width: 80%; /* Adjust the width of the grid */
      margin: 10px auto 0px auto; /* Center the grid */
      border: 0.1px solid black; /* Optional: Outer border for the grid */
    }
    .grid-3-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* Two equal columns */
      width: 80%; /* Adjust the width of the grid */
      margin: 10px auto 0px auto; /* Center the grid */
      border: 0.1px solid black; /* Optional: Outer border for the grid */
    }
   
     .grid-3table {
    width: 100%;
    border-collapse: collapse; 
    margin: 10px 0px 0px 0px;
    text-align: left;
  }

  .grid-3table th,
  .grid-3table td {
    border: 0.1px solid black;
    padding: 8px;
  }

  .grid-3table th {

  font-size:14;
  font-weight:bold;
  background-color: lightgray;  }

  .col1 {
    width: 60%; /* Column 1 takes 60% of the table */
  }

  .col2,
  .col3 {
    width: 20%; /* Columns 2 and 3 take 20% each */
  }


    .grid-3mod-container {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr; /* Two equal columns */
      width: 80%; /* Adjust the width of the grid */
      margin: 10px auto 0px auto; /* Center the grid */
      border: 0.1px solid black; /* Optional: Outer border for the grid */
    }
    .grid-3mod {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr; /* Two equal columns */
      width: 80%; /* Adjust the width of the grid */
      margin: 0px auto; /* Center the grid */
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* Two equal columns */
      width: 80%; /* Adjust the width of the grid */
      margin: 0px auto; /* Center the grid */
    }
   .grid-small-container {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      width: 25%; /* Adjust the width of the grid */
      border: 0.1px solid black; /* Optional: Outer border for the grid */
      margin-left: auto; /* Push the grid container to the right */
    }

    /* Grid item styling */
    .grid-item {
      border: 0.1px solid black; /* Border for each grid cell */
      text-transform: uppercase;
      font-size:12;
      padding: 2px; /* Add spacing inside the cell */
      text-align: left; 
    }
    .grid-child-item {
      text-transform: uppercase;
      font-size:12;
      text-align: left; /* Center text */
    }
        
        .boldFont{
          font-size:14;
          font-weight:bold;
          background-color: lightgray;
        }
        #smallFont{
          font-size:14;
          font-weight:500;

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
        padding: 20px;
        text-align: center;
      }
      </style>
    </head>
    <body style="" >
    <header style="padding:0px 20px 0px 20px;display:flex; justify-content:space-between;align-items:center" >
      <div id="headerLeft">
        <img style="width:60%; height:60%"
          src="../../../public/logo/c_light.jpeg" alt="UWave logo" />
      </div>
  
      <div id="headerRight" >
        <div  style="font-size:20px; font-weight:bold">
          UWave Logistics
        </div>
        <div style="font-size:12px;"  >
          <span >uwavelogistics@gmail.com</span>
          </br>
          <span >Auckland, New Zealand</span>
          </br>
          <span >
            <strong>Tel:
            </strong>
            +642904307658 
          </span>
          </br>
          <span >
            <strong>GST Number: </strong>143 710 983
          </span>
          </br>
        </div>
      </div>
  </header> 

    <section  >
        <div style="padding:20px 0 0 20px;margin" class="centered-div" >
          <span id="smallFont">TRACKING NUMBER:</span>
          <strong id="user">${data.providerTrackingID ? data.providerTrackingID : data.id}</strong>
          </div>
          
            
    </section>

    <section>
      <div class="grid-2-container">
        <div class="grid-item boldFont">SUPPLIER</div>
        <div class="grid-item boldFont">IMPORTER</div>
        <div class="grid-item boldFont">INVOICE DUE DATE</div>
        </div>
        <div class="grid-2">
          <div class="grid-child-item">${data.customerName}</div>
          <div class="grid-child-item">UWAVE LOGISTICS LTD</div>
          <div class="grid-child-item">${data.invoiceDueDate}</div>
        </div>
    </section>

    <section>
      <div class="grid-3-container">
        <div class="grid-item boldFont">DROPPED DATE</div>
        <div class="grid-item boldFont">WEIGHT</div>
        <div class="grid-item boldFont">PACKAGE</div>
      </div>
      <div class="grid-3">
        <div class="grid-child-item">${data.dateDropped}</div>
        <div class="grid-child-item">${data.parcelWeight} KG</div>
        <div class="grid-child-item">${data.noOfPackages}</div>
      </div>
    </section>
    <section>
      <div class="grid-3mod-container">
        <div class="grid-item boldFont">ORIGIN</div>
        <div class="grid-item boldFont">DESTINATION</div>
        <div class="grid-item boldFont">ETA</div>
      </div>

      <div class="grid-3mod">
        <div class="grid-child-item">${data.origin}</div>
        <div class="grid-child-item">AUCKLAND, NEWZEALAND</div>
        <div class="grid-child-item">${data.eta}</div>
      </div>
   
      </section>

      

                <table class="grid-3table">
  <thead>
    <tr>
      <th class="col1 ">DESCRIPTION</th> <!-- Header for first column -->
      <th class="col2 ">GST IN NZD (15%)</th> <!-- Header for second column -->
      <th class="col3 ">CHARGES in NZD ($)</th> <!-- Header for third column -->
    </tr>
  </thead>
  <tbody>
   ${JSON.parse(data.tableData)
     .map(
       (i) =>
         `
    <tr>
      <td class="col1">${i.selectedFee}</td>
      <td class="col2">${i.gst ? i.gst.toFixed(2) : ''}</td>
      <td class="col3">${
        i.charge
          ? typeof i.charge == 'number'
            ? i.charge.toFixed(2)
            : i.charge
          : ''
      }</td>
    </tr>
      `,
     )
     .join('')}
   
  </tbody>
</table>
      <div class="grid-small-container">
        <div class="grid-item boldFont">SUBTOTAL</div>
        <div class="grid-item ">${data.subTotal ? data.subTotal.toFixed(2) : 0}</div>
        <div class="grid-item boldFont">ADD GST</div>
        <div class="grid-item ">${data.gst ? data.gst.toFixed(2) : 0}</div>
        <div class="grid-item boldFont">TOTAL NZD</div>
        <div class="grid-item ">${(data.subTotal + data.gst).toFixed(2)}</div>
      </div>

      <div style="font-size:12px;"  >
      <strong>
        Important Notes
      </strong>
        <ul>
        Please note clearance fee includes the following charges:
          <li>
          All port charges
          </li>
          <li>
          Agency fee.
          </li>
          <li>
          Power and Monitoring fees
          </li>
          <li>
          EDI fees
          </li>
          <li>
          ATF Site fee for FCL
          </li>
          <li>
          Container Wash
          </li>
          <li>
          Container Devain
          </li>
          <li>
          Product Palletising
          </li>
          <li>
          Port to ATF site Transportation & ATF to Port
          </li>
          <li>
          MPI Application fee
          </li>
          <li>
          Container Dehire
          </li>
        
   
        </ul>
      </div>

    <section style="margin:20px 0px 0px 0px;font-size:10px;">
      <hr/>
      <pre style="font-weight:bold" >
        Eft payments to:
        Bank   ANZ BANK LIMITED
        Account   01-0286-0975830-00
        UWAVE CORPORATE LTD
        PAY Ref: ${data.customerName}  ${data.id}
      </pre >
      <hr/>
      <div style="font-weight:bold" >

        This invoice & any orders or business entered in to is subject to UWAVE LOGISTICS Ltd 'Standard Trading Conditions / Conditions of Contract'. 
        Insurance is not arranged unless requested by written application prior to shipment. 
        Please contact us within 7 days should there be any discrepancies.
      </div>
      <hr/>


    </section>

    </body>
  </html>`;

    return htmlData;
  }
}
