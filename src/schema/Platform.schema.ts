import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Platform")
export default class HardwareType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Values
    Name: string;
    @Column({nullable: true})
    IconURL?: string;
}