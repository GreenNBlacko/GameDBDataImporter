import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import CommunityContent from "../CommunityContent.schema";
import { Block } from "./Block.schema";

@Entity("TextImageBlock")
export default class TextImageBlock extends Block {
    // Values
    @Column()
    Content: string;

    @Column()
    Image: string;

    // Foreign keys
    @ManyToOne(() => CommunityContent)
    @JoinColumn({name: "CommunityContentID"})
    content: CommunityContent;
}