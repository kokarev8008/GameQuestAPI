import valid from "./valid-post-quests.json" with { type: "json" }
import titleMissing from "./invalid-post-titleMissing.json" with { type: "json" }
import rewardXpString from "./invalid-post-rewardXpString.json" with { type: "json" }
import rewardXpDecimal from "./invalid-post-rewardXpDecimal.json" with { type: "json" }
import rewardXpDifficuluty from "./invalid-post-rewardXp-difficulty.json" with { type: "json" }
import descriptionType from "./invalid-post-descriptionType.json" with { type: "json" }
import descriptionLength from "./invalid-post-descriptionLength.json" with { type: "json" }
import completedIdCreatedAtUnknownField from "./invalid-post-completed-id-createdAt-unknownField.json" with { type: "json" }

export const questFixtures = {
    valid,
    invalid: {
        titleMissing,
        rewardXpString,
        rewardXpDecimal,
        rewardXpDifficuluty,
        descriptionType,
        descriptionLength,
        completedIdCreatedAtUnknownField
    }
}