export default class Quest {
    constructor(id, title, difficulty, rewardXp, completed = false) {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.rewardXp = rewardXp;
        this.completed = completed;
        this.createdAt = new Date();
    }
}