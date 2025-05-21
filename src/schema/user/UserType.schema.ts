import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("UserType")
export default class UserType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Label: string;
}