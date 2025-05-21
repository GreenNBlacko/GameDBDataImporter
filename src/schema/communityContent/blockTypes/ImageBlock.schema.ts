import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import CommunityContent from "../CommunityContent.schema";
import { Block } from "./Block.schema";

@Entity("ImageBlock")
export default class ImageBlock extends Block {
    // Values
    @Column()
    Image: string;

    // Foreign keys
    @ManyToOne(() => CommunityContent)
    @JoinColumn({name: "CommunityContentID"})
    content: CommunityContent;
}