import pool from "../db/pool.ts";
import Quest from "../controllers/models/Quest.js";
import type { PoolTest } from "../db/pool.ts";

export class QuestRepository {
    private pool: PoolTest;

    constructor(pool: PoolTest) {
        this.pool = pool;
    }

    async getAllQuests() {
        try {
            if (this.pool.test != undefined) throw new Error("for_Test_Error");

            const result = await this.pool.query("SELECT * FROM quests ORDER BY id ASC");
    
            return this._questfromSnakeCaseToCamelCase(result.rows);
            
        } catch (error) {
            return null;
        }
    }

    async getQuestById(id: number) {
        try {
            const result = await this.pool.query("SELECT * FROM quests WHERE id = $1", [id]);
            
            if (result.rows.length === 0) return undefined;

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
            if (this.pool.test !== undefined) throw new Error("for_Test_Error");

            const result = await this.pool.query(query);
            
            return this._fromSnakeCaseToCamelCase(result.rows[0]);
        } catch (error) {
            return null;            
        }
    }

    async createQuest(title: string, difficulty: string, rewardXp: number, description = "") {
        const query = "INSERT INTO quests (title, difficulty, reward_xp, description)" + 
                        "VALUES ($1, $2, $3, $4) RETURNING *";

        try {
            const result = await this.pool.query(query, [title, difficulty, rewardXp, description]);
    
            const camelCaseResult = this._questfromSnakeCaseToCamelCase(result.rows[0]);
    
            return camelCaseResult instanceof Quest ? camelCaseResult : null;

        } catch (error) {
            return null;
        }
    }

    async updateQuest(id: number, data: Quest) { 
        const whiteList = ["title", "description", "rewardXp", "difficulty", "completed"];

        const unknownFieldArr = [];

        const safeKeysArr = Object.keys(data)
            .map((key) => key === "rewardXp" ? "reward_xp" : key)
            .filter((key) => {
                if (whiteList.includes(key) || key === "reward_xp") return true;
                else {
                    unknownFieldArr.push(key);
                    return false;
                };
            });
        
        if (unknownFieldArr.length > 0) return null;

        const sqlKeysArr = safeKeysArr.map((key, index) => `${key} = $${index + 2}`).join(", ");

        const query = `UPDATE quests SET ${sqlKeysArr} WHERE id = $1 RETURNING *`;

        const values = [];

        for (const key in data) {
            if (!whiteList.includes(key)) continue;
            
            const element = data[key as keyof Quest];

            values.push(element);
        }
        
        const result = await this.pool.query(query, [id, ...values]);

        if (result.rowCount === 0) return undefined;

        const camelCaseResult = this._questfromSnakeCaseToCamelCase(result.rows[0]);

        return camelCaseResult instanceof Quest ? camelCaseResult : null;
    }

    async deleteQuest(id: number) {
        try {
            const query = "DELETE FROM quests WHERE id = $1"
            
            if (this.pool.test !== undefined) throw new Error("test_error");

            const result = await this.pool.query(query, [id]);
            
            if (result.rowCount === 0) return undefined;
            
            return result.rows; 
        } catch (error) {
            return null;
        }
    }

    _questfromSnakeCaseToCamelCase(resultRows: Array<any> | any) {
        if (Array.isArray(resultRows)) {
            const mappedResult = resultRows.map((obj) => {
                return new Quest(obj.id, obj.title, obj.difficulty, obj.reward_xp, obj.description, obj.completed, obj.created_at);
            });

            return mappedResult;
        } else {
            return new Quest(resultRows.id, resultRows.title, resultRows.difficulty, resultRows.reward_xp, resultRows.description, resultRows.completed, resultRows.created_at);
        }
    }

    _fromSnakeCaseToCamelCase(resultRow: any) {
        return Object.fromEntries(Object.entries(resultRow)
            .map(([key, element]) => [key
                    .split("_")
                    .map((val, index) => index != 0 ? val.replace(val[0] as string, (val[0] as string).toUpperCase()) : val)
                    .join(""), 
                    element]));
    }
}

export default new QuestRepository(pool);