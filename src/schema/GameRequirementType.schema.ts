import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("GameRequirementType")
export default class GameRequirementType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Values
    Label: string = "";
}