import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../User.schema";
import TrackedGameStatus from "./TrackedGameStatus.schema";
import Game from "../../game/Game.schema";

@Entity("TrackedGame")
export default class TrackedGame extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Foreign keys
    @ManyToOne(() => TrackedGameStatus, {eager: true, nullable: false})
    @JoinColumn({name: "StatusID"})
    status: TrackedGameStatus;

    @ManyToOne(() => Game, {eager: true, nullable: false})
    game: Game;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "UserID"})
    user: User;
}