import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const createS3Client = (accessKeyId: string, secretAccessKey: string, region: string) => {
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export const s3Service = {
  async uploadFile(client: S3Client, bucket: string, key: string, body: Buffer, contentType?: string) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
    return await client.send(command)
  },

  async getFile(client: S3Client, bucket: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    return await client.send(command)
  },

  async deleteFile(client: S3Client, bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    return await client.send(command)
  },

  async listFiles(client: S3Client, bucket: string, prefix?: string) {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })
    return await client.send(command)
  },

  async getSignedUrl(client: S3Client, bucket: string, key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    return await getSignedUrl(client, command, { expiresIn })
  },
}
