import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
@Injectable()
export class ShareService {
  private readonly cryptoKey: string;
  constructor(private readonly configService: ConfigService) {
    this.cryptoKey = this.configService.get<string>('CRYPTO_KEY') as string;
  }
  // AES加密
  aesEncrypt(msg: string) {
    return CryptoJS.AES.encrypt(msg, this.cryptoKey).toString();
  }

  // AES解密
  aesDecrypt(msg: string) {
    return CryptoJS.AES.decrypt(msg, this.cryptoKey).toString(
      CryptoJS.enc.Utf8,
    );
  }

  // Md5加密
  md5Encrypt(msg: string) {
    return CryptoJS.MD5(msg).toString();
  }

  /**
   * @description: 生成一个UUID
   * @param {*}
   * @return {*}
   */
  generateUUID(): string {
    return uuid();
  }
}
