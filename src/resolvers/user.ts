import { User } from '../entities/User';
import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
@ObjectType()
class FieldError {
  @Field()
  field: String;
  @Field()
  message: String;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      //email not in database
      return true;
    } else {
      const token = v4();

      await redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        'ex',
        1000 * 60 * 60 * 72
      );

      await sendEmail(
        email,
        `<a href="http://localhost:3000/change-password/${token}"> reset password`
      );
    }

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session!.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      console.log(errors);
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);

    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          email: options.email,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');
      user = result[0];
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already exsits',
            },
          ],
        };
      }
      console.log('message', err.message);
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'username does not exist',
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password is wrong',
          },
        ],
      };
    }
    //store userid, set cookie, persist login
    req.session!.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
