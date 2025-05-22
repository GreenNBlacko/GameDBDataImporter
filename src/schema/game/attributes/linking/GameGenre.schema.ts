import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Game from "../../Game.schema";
import Genre from "../Genre.schema";

@Entity("GameGenre")
export default class GameGenre extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Foreign keys
    @ManyToOne(() => Game, {nullable: false})
    @JoinColumn({name: "GameID"})
    game: Game

    @ManyToOne(() => Genre, {eager: true, nullable: false})
    @JoinColumn({name: "GenreID"})
    genre: Genre
}