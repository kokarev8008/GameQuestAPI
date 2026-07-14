import valid from "./valid-patch-allowedFields.json" with { type: "json" };
import idCreatedAtUnknownField from "./invalid-patch-id-createdAt-unknownField.json" with { type: "json" };
import emptyBody from "./invalid-patch-emptyBody.json" with { type: "json" };

export const patchQuestFixtures = {
    valid,
    invalid: {
        idCreatedAtUnknownField,
        emptyBody,
    }
}