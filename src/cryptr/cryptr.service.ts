import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptrService {
  private Cryptr = require('cryptr');
  private cryptr = new this.Cryptr(process.env.CRYPTR_KEY);

  encrypt(data: string): string {
    return this.cryptr.encrypt(data);
  }

  decrypt(encryptedData: string): string {
    return this.cryptr.decrypt(encryptedData);
  }
}
