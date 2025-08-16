import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Route,
  SuccessResponse,
  Res,
  TsoaResponse,
} from 'tsoa';
import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { publicUser } from '../interfaces/publicUser.interface';

const userRepository = new UserRepository();

@Route('users')
export class UsersController extends Controller {
  @Get('{userEmail}')
  public async getUserByEmail(
    @Path() userEmail: string,
    @Res() notFoundResponse: TsoaResponse<400, { reason: string }>,
  ): Promise<User | null> {
    var res = await userRepository.getByEmail(userEmail);
    if (res === null) {
      return notFoundResponse(400, { reason: `no user was found with the mail of ${userEmail}` });
    }
    return res;
  }

  /**
   * Birth date in YYYY-MM-DD format
   * @example "1990-05-23"
   */
  @SuccessResponse('201', 'Created')
  @Post()
  public async createUser(@Body() requestBody: publicUser) {
    return await userRepository.create(requestBody);
  }

  @Put('{userId}')
  public async updateUser(@Path() userId: string, @Body() requestBody: Partial<publicUser>) {
    return await userRepository.update(userId, requestBody);
  }

  @Delete('{userId}')
  public async deleteUser(@Path() userId: string) {
    return await userRepository.delete(userId);
  }
}
