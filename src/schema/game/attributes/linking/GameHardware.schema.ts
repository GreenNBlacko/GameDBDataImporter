import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GameRequirementType from "./GameRequirementType.schema";
import Game from "../../Game.schema";
import Hardware from "../Hardware.schema";

@Entity("GameHardware")
export default class GameHardware extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Relations
    @ManyToOne(() => GameRequirementType, {eager: true, nullable: false})
    RequirementType: GameRequirementType;

    @ManyToOne(() => Game, (game: Game) => game.Hardware, {nullable: false})
    Game: Game;
    
    @ManyToOne(() => Hardware, {eager: true, nullable: false})
    Hardware: Hardware;
}