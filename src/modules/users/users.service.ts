import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Redis } from 'ioredis';
import { Model } from 'mongoose';
import { REDIS_CLIENT_TOKEN } from '../redis/redis.module';
import { CreateUserDto, ListUserDto, UpdateUserScoreDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(REDIS_CLIENT_TOKEN)
    private readonly redisClient: Redis,
  ) {}
  /**
   * Create user
   * @param createUserDto
   * @returns
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    newUser.save();

    // Push user's info to redis using hashes data type
    this.redisClient.hmset(
      `user:${newUser['_doc']._id}`,
      'username',
      createUserDto.username,
      'email',
      createUserDto.email,
    );

    return newUser;
  }

  /**
   * Update user's score
   * @param updateUserScoreDto
   */
  async updateUserScore(updateUserScoreDto: UpdateUserScoreDto): Promise<User> {
    const { userId, score } = updateUserScoreDto;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { score },
      { new: true },
    );

    // Push user's score to redis using sorted data type
    this.redisClient.zadd(
      'user:leaderboard',
      score,
      `user:${updatedUser['_doc']._id}`,
    );

    return updatedUser;
  }

  /**
   * Get list user
   * @param listUserDto
   */
  async getUsers(listUserDto: ListUserDto) {
    const pagination = listUserDto.pagination;

    if (pagination) {
      return await this.userModel.find();
    }

    const page = listUserDto.page || 1;
    const perPage = listUserDto.perPage || 10;
    const skip = (page - 1) * perPage;

    return await this.userModel.find().skip(skip).limit(perPage);
  }

  /**
   * Get user's rank
   * @param listUserDto
   */
  async leaderBoard(listUserDto: ListUserDto) {
    const page = listUserDto.page || 1;
    const perPage = listUserDto.perPage || 10;
    const min = (page - 1) * perPage;
    const max = min + (perPage - 1);

    // Get leaderboard (sorted data) using zrevrange
    const leaderboard = await this.redisClient.zrevrange(
      'user:leaderboard',
      min,
      max,
      'WITHSCORES',
    );

    const results = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      // Get user info from redis (hashes data)
      const userInfo = await this.redisClient.hgetall(leaderboard[i]);
      const user = {
        ...userInfo,
        score: leaderboard[i + 1],
      };
      results.push(user);
    }
    return results;
  }
}
