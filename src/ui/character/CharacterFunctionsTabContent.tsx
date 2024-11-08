import { Objects } from "@mjtdev/engine";
import { Flex, Tabs } from "@radix-ui/themes";
import type { AppCharacter } from "ai-worker-common";
import { LOCAL_AI_FUNCTIONS } from "../../ai-function/LOCAL_AI_FUNCTIONS";
import { AI_FUNCTIONS } from "../../ai-function/AI_FUNCTIONS";
import { MultipleChoiceDisplay } from "../user/MultipleChoiceDisplay";

export const CharacterFunctionsTabContent = ({
  tabKey,
  onChange,
  character,
  extraDirection = "",
}: {
  extraDirection?: string;
  tabKey: string;
  character: AppCharacter;
  onChange: (value: string[]) => void;
}) => {
  const names = Objects.fromEntries(
    Objects.keys(LOCAL_AI_FUNCTIONS)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => [k, k])
  );
  const tooltips = Objects.fromEntries(
    AI_FUNCTIONS.map((func, i) => {
      return [func.name, func.usage];
    })
  );
  const defaultFunctions = character.card.data.extensions?.functions ?? [];

  return (
    <Tabs.Content style={{ width: "100%" }} key={tabKey} value={tabKey}>
      <Flex
        style={{
          width: "100%",
          minWidth: "40em",
          // height: "100%",
          // maxHeight: "50vh",
        }}
        direction={"column"}
      >
        <MultipleChoiceDisplay
          names={names}
          tooltips={tooltips}
          onChange={onChange}
          possibleValues={Objects.keys(names)}
          defaultValue={defaultFunctions}
        />
      </Flex>
    </Tabs.Content>
  );
};