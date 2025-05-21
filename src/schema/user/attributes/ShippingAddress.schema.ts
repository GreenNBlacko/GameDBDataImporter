import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../User.schema";
import City from "../../City.schema";

@Entity("ShippingAddress")
export default class ShippingAddress extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Street: string;

    @Column()
    HouseNumber: number;

    @Column({nullable: true})
    ApartmentNumber?: number;

    // Foreign keys
    @ManyToOne(() => User)
    @JoinColumn({name: "UserID"})
    user: User;
    
    @ManyToOne(() => City, {eager: true})
    @JoinColumn({name: "CityID"})
    city: City;
}