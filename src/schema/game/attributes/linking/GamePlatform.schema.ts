import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Game from "../../Game.schema";
import Platform from "../Platform.schema";

@Entity("GamePlatform")
export default class GamePlatform extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Foreign keys
    @ManyToOne(() => Game, {nullable: false})
    @JoinColumn({name: "GameID"})
    game: Game

    @ManyToOne(() => Platform, {eager: true, nullable: false})
    @JoinColumn({name: "PlatformID"})
    platform: Platform
}