import { Buffer } from 'buffer';

export default class ImageConverterUtils {
  static bufferToBase64(buffer: Buffer): string {
    return `data:image/${this.getMimeType(buffer)};base64,${Buffer.from(buffer).toString('base64')}`;
  }

  private static getMimeType(buffer: Buffer): string {
    switch (buffer[0]) {
      case 0x89:
        return 'png';
      case 0x27:
        return 'jpeg';
      default:
        return 'image/jpeg';
    }
  }

  static base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
  }
}
