import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Game from "../../Game.schema";
import AgeRating from "../AgeRating.schema";

@Entity("GameAgeRating")
export default class GameAgeRating extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Foreign keys
    @ManyToOne(() => Game)
    @JoinColumn({name: "GameID"})
    game: Game

    @ManyToOne(() => AgeRating, {eager: true, nullable: false})
    @JoinColumn({name: "AgeRatingID"})
    ageRating: AgeRating
}