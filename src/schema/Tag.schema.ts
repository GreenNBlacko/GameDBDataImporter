import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Tag")
export default class HardwareType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Values
    Name: string = "";
}