import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Game from "../../Game.schema";
import Critic from "../Critic.schema";

@Entity("CriticReview")
export default class CriticReview extends BaseEntity {
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
    @ManyToOne(() => Game)
    @JoinColumn({name: "GameID"})
    game: Game;
    
    @ManyToOne(() => Critic, {eager: true})
    @JoinColumn({name: "CriticID"})
    critic: Critic;
}