import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("LicenseType")
export default class LicenseType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Label: string;
}