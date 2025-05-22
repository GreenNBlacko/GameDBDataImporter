import { Column, Entity } from "typeorm";
import { Block } from "./Block.schema";

@Entity("ImageBlock")
export default class ImageBlock extends Block {
    // Values
    @Column()
    Image: string;
}