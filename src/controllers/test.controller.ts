import { Controller, Get, Route, Response, Example } from 'tsoa';

@Route('test')
export class TestController extends Controller {
  @Get('/')
  @Response<string>(200, 'Success')
  public async getTest(): Promise<string> {
    return 'API is working!';
  }

  @Get('/buh')
  @Response<string>(200, 'Success')
  public async getBuh(): Promise<string> {
    return 'Buh';
  }
}
