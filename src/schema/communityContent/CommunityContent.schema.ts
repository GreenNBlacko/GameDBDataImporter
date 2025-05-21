import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import CommunityContentType from "./CommunityContentType.schema";
import Game from "../game/Game.schema";
import User from "../user/User.schema";

@Entity("CommunityContent")
export default class CommunityContent extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Title: string;

    // Foreign keys
    @ManyToOne(() => CommunityContentType, {eager: true})
    @JoinColumn({name: "TypeID"})
    type: CommunityContentType;

    @ManyToOne(() => Game, {eager: true})
    @JoinColumn({name: "GameID"})
    game: Game;

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({name: "UserID"})
    user: User;
}