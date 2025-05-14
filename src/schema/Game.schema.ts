import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GameHardware from "./GameHardware.schema";

@Entity("Game")
export default class Game extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number = 0;

    // Values
    Name: string = "";
    Description: string = "";

    // Relations
    @OneToMany(() => GameHardware, (GameHardware: GameHardware) => GameHardware.Game, {eager: true})
    Hardware: GameHardware[]
}