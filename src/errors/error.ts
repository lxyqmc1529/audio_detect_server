export class ErrorResponse {
  public errcode: number;
  public errmsg: string;
  
  constructor(errcode: number, errmsg: string) {
    this.errcode = errcode;
    this.errmsg = errmsg;
  }
}