import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import HardwareType from "./HardwareType.schema";

@Entity("Hardware")
export default class Hardware extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Value: string;

    // Relations
    @ManyToOne(() => HardwareType, {eager: true})
    Type: HardwareType
}