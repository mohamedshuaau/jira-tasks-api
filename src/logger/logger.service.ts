import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class LoggerService {
  /**
   * Generic Logs
   *
   * @param message
   */
  log(message: string): void {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  /**
   * Error level logs
   *
   * @param message
   * @param error
   */
  error(message: string, error: Error = null): void {
    // eslint-disable-next-line no-console
    console.error(message, error);
    throw new InternalServerErrorException({ message, error });
  }

  /**
   * Warning logs
   *
   * @param message
   */
  warn(message: string): void {
    // eslint-disable-next-line no-console
    console.warn(message);
  }

  /**
   * Debug Logs logs
   *
   * @param message
   */
  debug(message: string): void {
    // eslint-disable-next-line no-console
    console.debug(message);
  }

  /**
   * Verbose logs
   *
   * @param message
   */
  verbose(message: string): void {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
