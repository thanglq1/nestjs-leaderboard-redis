import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto, ListUserDto, UpdateUserScoreDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Patch()
  async updateUserScore(
    @Body() updateUserScoreDto: UpdateUserScoreDto,
  ): Promise<User> {
    return await this.userService.updateUserScore(updateUserScoreDto);
  }

  @Get()
  async getUsers(@Query() listUserDto: ListUserDto) {
    return await this.userService.getUsers(listUserDto);
  }

  @Get('leaderboard')
  async leaderBoard(@Query() listUserDto: ListUserDto) {
    return await this.userService.leaderBoard(listUserDto);
  }
}
