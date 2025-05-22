import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Game from "../../Game.schema";
import Tag from "../Tag.schema";

@Entity("GameTag")
export default class GameTag extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Foreign keys
    @ManyToOne(() => Game)
    @JoinColumn({name: "GameID"})
    game: Game

    @ManyToOne(() => Tag, {eager: true, nullable: false})
    @JoinColumn({name: "TagID"})
    tag: Tag
}