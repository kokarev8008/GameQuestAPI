import pool from "../db/pool.js";
import Quest from "../controllers/models/Quest.js";

class QuestRepository {
    async getAllQuests() {
        const result = await pool.query("SELECT * FROM quests ORDER BY id ASC");
        return this._fromSnakeCaseToCamelCase(result.rows);
    }

    async getQuestById(id) {
        const result = await pool.query("SELECT * FROM quests WHERE id = $1", [id]);
        return this._fromSnakeCaseToCamelCase(result.rows[0]);
    }

    async createQuest(title, difficulty, rewardXp, description = "") {
        const query = "INSERT INTO quests (title, difficulty, reward_xp, description)" + 
                        "VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(query, [title, difficulty, rewardXp, description]);

        return this._fromSnakeCaseToCamelCase(result.rows[0]);
    }

    async updateQuest(id, post) { 
        const blackList = ["id", "createdAt"];

        const safeKeysArr = Object.keys(post)
            .map((key) => key === "rewardXp" ? "reward_xp" : key)
            .filter((key) => !blackList.includes(key));

        const sqlKeysArr = safeKeysArr.map((key, index) => `${key} = $${index + 2}`).join(", ");

        const query = `UPDATE quests SET ${sqlKeysArr} WHERE id = $1 RETURNING *`;

        const values = [];

        for (const key in post) {
            if (blackList.includes(key)) continue;
            
            const element = post[key];
            
            values.push(element);
        }

        const result = await pool.query(query, [id, ...values]);

        return result.rows[0];
    }

    async deleteQuest(id) {
        const query = "DELETE FROM quests WHERE id = $1"
        
        await pool.query(query, [id]);

        return null;
    }

    _fromSnakeCaseToCamelCase(resultRows) {
        if (Array.isArray(resultRows)) {
            const mappedResult = resultRows.map((obj) => {
                return new Quest(obj.id, obj.title, obj.difficulty, obj.reward_xp, obj.description, obj.completed, obj.created_at);
            });

            return mappedResult;
        } else {
            return new Quest(resultRows.id, resultRows.title, resultRows.difficulty, resultRows.reward_xp, resultRows.description, resultRows.completed, resultRows.created_at);
        }
    }
}

export default new QuestRepository();