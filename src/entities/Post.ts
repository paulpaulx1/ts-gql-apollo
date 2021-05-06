import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity, ManyToOne } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt:Date;

  @Field(()=> String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column()
  title!: string;

  @Field()
  @ManyToOne(type => User, user => user.posts)
  creator: User;


  @Field()
  @Column()
  creatorId: number;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({type: 'int', default: 0})
  points!: number;
}