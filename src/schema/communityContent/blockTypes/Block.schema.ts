import { BaseEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import CommunityContent from "../CommunityContent.schema";

export abstract class Block extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number;

    @ManyToOne(() => CommunityContent, {eager:true, nullable: false})
    @JoinColumn({name: "CommunityContentID"})
    content: CommunityContent;
}