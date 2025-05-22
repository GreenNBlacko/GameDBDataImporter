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
    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "UserID"})
    user: User

    @ManyToOne(() => Game, {eager: true, nullable: false})
    @JoinColumn({name: "GameID"})
    game: Game
}