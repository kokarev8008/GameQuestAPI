import pool from "../db/pool.js";
import Quest from "../controllers/models/Quest.js";

class QuestRepository {
    async getAllQuests() {
        try {
            const result = await pool.query("SELECT * FROM quests ORDER BY id ASC");
    
            return this._questfromSnakeCaseToCamelCase(result.rows);
            
        } catch (error) {
            return null;
        }
    }

    async getQuestById(id) {
        try {
            const result = await pool.query("SELECT * FROM quests WHERE id = $1", [id]);
    
            const camelCaseResult = this._questfromSnakeCaseToCamelCase(result.rows[0]);
    
            return camelCaseResult instanceof Quest ? camelCaseResult : null;
        } catch (error) {
            return null;
        }
    }

    async getStats() {
        const query = "SELECT COUNT(*)::integer AS total, COUNT(completed) " + 
        "FILTER(WHERE completed = true)::integer AS completed, COUNT(completed) " + 
        "FILTER(WHERE completed = false)::integer AS active, COALESCE(SUM(reward_xp), 0)::integer AS total_reward_xp, " + 
        "COALESCE(round(AVG(reward_xp), 2)::REAL, 0) AS average_reward_xp, jsonb_build_object('easy', COUNT(*) FILTER(WHERE difficulty = 'easy'), " + 
        "'medium', COUNT(*) FILTER(WHERE difficulty = 'medium'), 'hard', COUNT(*) " +
        "FILTER(WHERE difficulty = 'hard')) AS by_difficulty FROM quests";

        try {
            if (pool.test != undefined) throw new Error("for_Test_Error");

            const result = await pool.query(query);
            
            return this._fromSnakeCaseToCamelCase(result.rows[0]);
        } catch (error) {
            return null;            
        }
    }

    async createQuest(title, difficulty, rewardXp, description = "") {
        const query = "INSERT INTO quests (title, difficulty, reward_xp, description)" + 
                        "VALUES ($1, $2, $3, $4) RETURNING *";

        try {
            const result = await pool.query(query, [title, difficulty, rewardXp, description]);
    
            const camelCaseResult = this._questfromSnakeCaseToCamelCase(result.rows[0]);
    
            return camelCaseResult instanceof Quest ? camelCaseResult : null;

        } catch (error) {
            return null;
        }
    }

    async updateQuest(id, post) { 
        try {
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
    
            const camelCaseResult = this._questfromSnakeCaseToCamelCase(result.rows[0]);
    
            return camelCaseResult instanceof Quest ? camelCaseResult : null;
            
        } catch (error) {
            return null;
        }
    }

    async deleteQuest(id) {
        try {
            const query = "DELETE FROM quests WHERE id = $1"
            
            await pool.query(query, [id]);
    
            return null;
        } catch (error) {
            return null;
        }
    }

    _questfromSnakeCaseToCamelCase(resultRows) {
        if (Array.isArray(resultRows)) {
            const mappedResult = resultRows.map((obj) => {
                return new Quest(obj.id, obj.title, obj.difficulty, obj.reward_xp, obj.description, obj.completed, obj.created_at);
            });

            return mappedResult;
        } else {
            return new Quest(resultRows.id, resultRows.title, resultRows.difficulty, resultRows.reward_xp, resultRows.description, resultRows.completed, resultRows.created_at);
        }
    }

    _fromSnakeCaseToCamelCase(resultRow) {
        return Object.fromEntries(Object.entries(resultRow)
            .map(([key, element]) => [key
                    .split("_")
                    .map((val, index) => index != 0 ? val.replace(val[0], val[0].toUpperCase()) : val)
                    .join(""), 
                    element]));
    }
}

export default new QuestRepository();