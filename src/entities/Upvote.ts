import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";


//many to many User <-> Posts

// users can upvote many posts posts can be upvoted by many users

//user -> join table (upvotes) <- posts
@ObjectType()
@Entity()
export class Upvote extends BaseEntity {

  @Column({type: "int"})
  value: number;


  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;


  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.upvotes, {
    onDelete: "CASCADE"
  })
  post: Post;


}