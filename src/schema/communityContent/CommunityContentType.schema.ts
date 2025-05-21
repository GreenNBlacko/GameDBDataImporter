import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CommunityContentType")
export default class CommunityContentType extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Label: string;
}