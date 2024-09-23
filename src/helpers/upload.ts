import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  async uploadImage(img_string: string, dir: string, filename: string): Promise<boolean> {
    // Extract base64 part of the image
    const base64Image = img_string.split(';base64,').pop();

    // Make the directory path if it doesn't exist
    const dirPath = path.resolve(dir);

    try {
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write the file
      await fs.promises.writeFile(path.join(dirPath, filename), base64Image, { encoding: 'base64' });
      return true;
    } catch (err) {
      throw new HttpException('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
