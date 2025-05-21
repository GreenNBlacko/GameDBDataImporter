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
    @ManyToOne(() => UserImageType, {eager: true})
    @JoinColumn({name: "ImageType"})
    imageType: UserImageType;

    @ManyToOne(() => User)
    @JoinColumn({name: "UserID"})
    user: User;
}