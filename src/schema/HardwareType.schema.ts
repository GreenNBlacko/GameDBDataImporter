import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("HardwareType")
export default class HardwareType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Values
    Name: string = "";
}