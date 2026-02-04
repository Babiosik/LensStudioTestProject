import { GameEvent } from '../GameEvent';

const ScoreText = "Score:\n";
const BestScoreText = "Best score: ";
const NewBestScoreText = "New best score:\n";

@component
export class RewardScore extends BaseScriptComponent {

    @input
    text: Text;

    private score: number = 0;
    private bestScore: number = 0;

    onAwake(): void {
        this.score = 0;
        GameEvent.Start.add(() => this.onStart());
        GameEvent.Restart.add(() => this.onRestart());
        GameEvent.RewardGet.add(() => this.onRewardGet());
    }

    onStart(): void {
        this.score = 0;
        this.scoreUpdate();
    }

    onRestart(): void {
        if (this.score <= this.bestScore)
            return;

        this.text.text = `${NewBestScoreText}${this.score}`;
        this.bestScore = this.score;
    }

    onRewardGet(): void {
        this.score++;
        this.scoreUpdate();
    }

    scoreUpdate(): void {
        this.text.text = `${BestScoreText}${this.bestScore}\n${ScoreText}${this.score}`;
    }
}
