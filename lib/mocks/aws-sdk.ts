// Mock AWS SDK implementations for TypeScript compilation

export class S3Client {
  constructor(config?: any) {}
  
  send(command: any): Promise<any> {
    return Promise.resolve({});
  }
}

export class GetObjectCommand {
  constructor(params: any) {}
}

export class PutObjectCommand {
  constructor(params: any) {}
}

export class DeleteObjectCommand {
  constructor(params: any) {}
}

export class ListObjectsV2Command {
  constructor(params: any) {}
}

export const getSignedUrl = (client: any, command: any, options?: any): Promise<string> => {
  return Promise.resolve('https://mock-signed-url.com');
};

export default S3Client;