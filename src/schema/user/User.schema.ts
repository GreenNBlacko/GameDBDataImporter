import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserType from "./UserType.schema";
import Country from "../Country.schema";
import ShippingAddress from "./attributes/ShippingAddress.schema";
import UserImage from "./attributes/UserImage.schema";

@Entity("User")
export default class User extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Username: string;

    @Column()
    Email: string;

    @Column()
    PasswordHash: string;

    // Foreign keys
    @ManyToOne(() => UserType, {eager: true, nullable: false})
    @JoinColumn({name: "UserType"})
    userType: UserType;

    @OneToMany(() => UserImage, (image) => image.user, {eager: true, nullable: false})
    userImages: UserImage[];

    @ManyToOne(() => Country, {eager: true, nullable: false})
    @JoinColumn({name: "CountryID"})
    country: Country;

    @OneToMany(() => ShippingAddress, (address) => address.user, {eager: true, nullable: false})
    shippingAddresses: ShippingAddress[];
}