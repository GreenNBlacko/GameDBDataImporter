import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserImageType from "./UserImageType.schema";
import User from "../User.schema";

@Entity("UserImage")
export default class UserImage extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    URL: string;

    // Foreign keys
    @ManyToOne(() => UserImageType, {eager: true, nullable: false})
    @JoinColumn({name: "ImageType"})
    imageType: UserImageType;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "UserID"})
    user: User;
}