import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import CommunityContent from "../CommunityContent.schema";
import { Block } from "./Block.schema";

@Entity("TextBlock")
export default class TextBlock extends Block {
    // Values
    @Column()
    Content: string;

    // Foreign keys
    @ManyToOne(() => CommunityContent)
    @JoinColumn({name: "CommunityContentID"})
    content: CommunityContent;
}