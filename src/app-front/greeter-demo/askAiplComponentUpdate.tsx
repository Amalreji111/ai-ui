import { safe, isDefined } from "@mjtdev/engine";
import type { AiplComponentContextState } from "../../aipl-components/AiplComponentContextState";

export const askAiplComponentUpdate = async (
  config: AiplComponentContextState | undefined,
  instruction?: string
) => {
  if (!config?.client || !config?.typeInfo?.schema) {
    return;
  }
  const typeName = config.typeInfo.schema.$id;

  const ans = await config.client.ask({
    userMessage: [
      instruction,
      `JSON ${typeName} response object ONLY! what is the current ${typeName} the user wants?`,
    ]
      .filter(isDefined)
      .join("\n"),
    toolConfig: {
      schema: config.typeInfo?.schema,
      current: config.componentState,
    },
  });
  console.log("ans", ans);
  const objMaybe = safe(() => JSON.parse(ans));
  console.log("objMaybe", objMaybe);
  if (isDefined(objMaybe)) {
    console.log("objMaybe", objMaybe);
    config.updateComponentState(objMaybe);
  }
};
