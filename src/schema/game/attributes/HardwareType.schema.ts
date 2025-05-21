import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("HardwareType")
export default class HardwareType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Name: string;
}