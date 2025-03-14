
export class AppError {
  public readonly message: string[] = [];
  public readonly statusCode: number;
  public readonly timeout: number =  process.env.MODE === 'DEV' ? 3000 : 15000;


  constructor(message: string | string[], statusCode = 400) {

    if (!Array.isArray(message)) {
      this.message[0] = message;
    } else {
      this.message = message;
    }
    this.statusCode = statusCode;
  }


}
