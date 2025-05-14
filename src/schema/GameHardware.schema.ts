import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GameRequirementType from "./GameRequirementType.schema";
import Game from "./Game.schema";
import Hardware from "./Hardware.schema";

@Entity("GameHardware")
export default class GameHardware extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Relations
    @ManyToOne(() => GameRequirementType)
    RequirementType: GameRequirementType;
    @ManyToOne(() => Game, (game: Game) => game.Hardware)
    Game: Game;
    @ManyToOne(() => Hardware)
    Hardware: Hardware;
}