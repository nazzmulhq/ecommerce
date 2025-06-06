// custom-writable-stream.ts
import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';

export class SafeArrayTransport extends Writable {
  private readonly logFilePath: string;

  constructor(logFilePath: string) {
    super();
    this.logFilePath = logFilePath;
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    const logDirectory = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  }

  _write(chunk: any, encoding: string, callback: any) {
    const message = JSON.parse(chunk.toString());
    try {
      const logContent = fs.existsSync(this.logFilePath)
        ? fs.readFileSync(this.logFilePath, 'utf8')
        : '';
      const logObject = JSON.parse(logContent || '[]');

      // Ensure the new log structure is appended correctly
      const newLogContent = JSON.stringify([message, ...logObject], null, 2);
      fs.writeFileSync(this.logFilePath, newLogContent, 'utf8');
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
