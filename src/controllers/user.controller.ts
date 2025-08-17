import {
  Body,
  Controller,
  Path,
  Post,
  Put,
  Delete,
  Route,
  SuccessResponse,
  Query,
  Get,
} from 'tsoa';
import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { loginForm, publicUser } from '../interfaces/publicUser.interface';

const userRepository = new UserRepository();

@Route('users')
export class UsersController extends Controller {
  @Get()
  public async getUser(@Query() id?: string, @Query() email?: string): Promise<User | null> {
    if (id) return userRepository.getById(id);
    if (email) return userRepository.getByEmail(email);
    return null;
  }

  @SuccessResponse('201', 'Logged in')
  @Post('/login')
  public async Login(@Body() loginForm: loginForm): Promise<string> {
    return await userRepository.login(loginForm.email, loginForm.password);
  }

  /**
   * Birth date in YYYY-MM-DD format
   * @example "1990-05-23"
   */
  @SuccessResponse('201', 'Registered')
  @Post('/register')
  public async Register(@Body() requestBody: publicUser) {
    return await userRepository.create(requestBody);
  }

  @Put('{userEmail}')
  public async updateUser(@Path() userEmail: string, @Body() requestBody: Partial<publicUser>) {
    return await userRepository.update(userEmail, requestBody);
  }

  @Delete('{userEmail}')
  public async deleteUser(@Path() userEmail: string) {
    return await userRepository.delete(userEmail);
  }
}
