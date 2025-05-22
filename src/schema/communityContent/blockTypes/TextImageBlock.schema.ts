import { Column, Entity } from "typeorm";
import { Block } from "./Block.schema";

@Entity("TextImageBlock")
export default class TextImageBlock extends Block {
    // Values
    @Column()
    Content: string;

    @Column()
    Image: string;
}