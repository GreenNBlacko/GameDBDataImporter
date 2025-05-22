import { Column, Entity } from "typeorm";
import { Block } from "./Block.schema";

@Entity("TextBlock")
export default class TextBlock extends Block {
    // Values
    @Column()
    Content: string;
}