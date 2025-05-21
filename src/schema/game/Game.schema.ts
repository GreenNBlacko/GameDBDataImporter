import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GameHardware from "./attributes/linking/GameHardware.schema";
import GameGenre from "./attributes/linking/GameGenre.schema";
import GameAgeRating from "./attributes/linking/GameAgeRating.schema";
import GamePlatform from "./attributes/linking/GamePlatform.schema";
import Platform from "./attributes/Platform.schema";
import CriticReview from "./attributes/linking/CriticReview.schema";

@Entity("Game")
export default class Game extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    ID: number;

    // Values
    @Column()
    Name: string;

    @Column({length: 2500})
    Description: string;

    @Column({nullable: true})
    CoverImage?: string;

    // Relations
    @OneToMany(() => GameHardware, (GameHardware: GameHardware) => GameHardware.Game, {eager: true})
    Hardware: GameHardware[];

    @OneToMany(() => GameGenre, (genre) => genre.game, {eager: true})
    Genres: GameGenre[];

    @OneToMany(() => GameAgeRating, (ageRating) => ageRating.game, {eager: true})
    AgeRatings: GameAgeRating[];

    @OneToMany(() => GamePlatform, (platform) => platform.game, {eager: true})
    Platforms: Platform[];

    @OneToMany(() => CriticReview, (review) => review.game, {eager: true})
    CriticReviews: CriticReview[];
}