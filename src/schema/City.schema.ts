import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Country from "./Country.schema";

@Entity("City")
export default class City extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Name: string;

    // Foreign keys
    @ManyToOne(() => Country, {eager: true, nullable: false})
    @JoinColumn({name: "CountryID"})
    country: Country;
}