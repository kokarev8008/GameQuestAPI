import allValid from "./valid-patch-allowedFields.json" with { type: "json" };
import idCreatedAtUnknownField from "./invalid-patch-id-createdAt-unknownField.json" with { type: "json" };
import emptyBody from "./invalid-patch-emptyBody.json" with { type: "json" };
import decriptionCleared from "./valid-patch-descriptionCleared.json" with { type: "json" };
import rewardXpIsStr from "./invalid-patch-rewardXpIsStr.json" with { type: "json" };
import decriptionLengthAlot from "./invalid-patch-descriptionAlotLenght.json" with { type: "json" };
import decriptionType from "./invalid-pathc-descriptionType.json" with { type: "json" };
import titleType from "./invalid-patch-titleType.json" with { type: "json" };

export const patchQuestFixtures = {
    valid: {
        decriptionCleared,
        allValid
    },

    invalid: {
        titleType,
        rewardXpIsStr,
        idCreatedAtUnknownField,
        emptyBody,
        decriptionCleared,
        decriptionLengthAlot,
        decriptionType,
    }
}