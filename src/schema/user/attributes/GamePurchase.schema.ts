import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../User.schema";
import Game from "../../game/Game.schema";
import ShippingAddress from "./ShippingAddress.schema";
import LicenseType from "./LicenseType.schema";

@Entity("GamePurchase")
export default class GamePurchase extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Values
    @Column()
    PurchaseDate: Date;

    // Foreign keys
    @ManyToOne(() => LicenseType, {eager: true, nullable: false})
    @JoinColumn({name: "TypeID"})
    license: LicenseType

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "UserID"})
    user: User;

    @ManyToOne(() => Game, {eager: true, nullable: false})
    @JoinColumn({name: "GameID"})
    game: Game
    
    @ManyToOne(() => ShippingAddress, {eager: true, nullable: true})
    @JoinColumn({name: "ShippingAddressID"})
    shippingAddress?: ShippingAddress
}