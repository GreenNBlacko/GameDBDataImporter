import { BaseEntity, PrimaryGeneratedColumn } from "typeorm";

export abstract class Block extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number;
}