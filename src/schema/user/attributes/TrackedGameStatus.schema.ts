import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("TrackedGameStatus")
export default class TrackedGameStatus extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Label: string;
}