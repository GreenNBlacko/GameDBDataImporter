import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Game from "../../Game.schema";
import Platform from "../Platform.schema";

@Entity("GamePlatform")
export default class GamePlatform extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Foreign keys
    @ManyToOne(() => Game)
    @JoinColumn({name: "GameID"})
    game: Game

    @ManyToOne(() => Platform, {eager: true})
    @JoinColumn({name: "PlatformID"})
    platform: Platform
}