import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("AgeRating")
export default class AgeRating extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Name: string;
    
    @Column({nullable: true})
    IconURL?: string;
}