import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("GameRequirementType")
export default class GameRequirementType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Label: string;
}