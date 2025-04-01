import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as minio from 'minio';
import { formatDay } from '../../utils/date';
import { ShareService } from '../../share/share.service';
@Injectable()
export class MinioService {
  private minioBucketName: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject('MINIO_CLIENT') private minioClient: minio.Client,
    private readonly shareService: ShareService,
  ) {
    this.minioBucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'test';
  }

  async getBuckets() {
    return await this.minioClient.listBuckets();
  }

  async uploadFile(bucketName: string, file: Express.Multer.File) {
    const fileName = `${formatDay()}/${Date.now()}-${this.shareService.generateUUID()}.${file.originalname}`;
    const exist = await this.minioClient.bucketExists(bucketName);
    if (!exist) {
      await this.minioClient.makeBucket(bucketName);
    }
    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    const expiry = 24 * 60 * 60 * 7;

    const presignedUrl = await this.minioClient.presignedUrl(
      'GET',
      bucketName,
      fileName,
      expiry,
    );

    return {
      url: presignedUrl,
    };
  }

  async presignedPutUrl(
    bucketName: string,
    fileName: string,
    expiry: number = 24 * 60 * 60,
  ) {
    return await this.minioClient.presignedPutObject(
      bucketName,
      fileName,
      expiry,
    );
  }

  async presignedGetUrl(
    bucketName: string,
    fileName: string,
    expiry: number = 24 * 60 * 60,
  ) {
    return await this.minioClient.presignedGetObject(
      bucketName,
      fileName,
      expiry,
    );
  }

  async presignedPostPolicy(
    bucketName: string,
    fileName: string,
    expiry: number = 24 * 60 * 60,
  ) {
    const policy = new minio.PostPolicy();
    policy.setBucket(bucketName);
    policy.setKey(fileName);
    policy.setExpires(new Date(new Date().getTime() + expiry * 1000));

    return await this.minioClient.presignedPostPolicy(policy);
  }

  async getObjectMeta(bucketName: string, fileName: string, statOpts = {}) {
    return await this.minioClient.statObject(bucketName, fileName, statOpts);
  }
}
