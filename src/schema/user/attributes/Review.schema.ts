import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../User.schema";
import Game from "../../game/Game.schema";

@Entity("Review")
export default class Review extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Title: string;

    @Column()
    Content: string;

    @Column()
    Score: number;

    // Foreign keys
    @ManyToOne(() => User)
    @JoinColumn({name: "UserID"})
    user: User

    @ManyToOne(() => Game, {eager: true})
    @JoinColumn({name: "GameID"})
    game: Game
}