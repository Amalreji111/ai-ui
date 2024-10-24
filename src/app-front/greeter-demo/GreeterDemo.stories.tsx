import type { Meta, StoryObj } from "@storybook/react/*";
import type { ComponentProps } from "react";
import { mockConfig } from "../../aipl-components/mockConfig";
import { AiplComponentProvider } from "../../provider/AiplComponentProvider";
import { GreeterDemo } from "./GreeterDemo";

type StoryProps = ComponentProps<typeof GreeterDemo> & {
  papId: string;
  aiplHomeUrl: string;
};

const meta: Meta<StoryProps> = {
  component: GreeterDemo,
  tags: ["autodocs"],
  argTypes: {
    papId: { control: { type: "text" } },
    aiplHomeUrl: { control: { type: "text" } },
  },
};

export default meta;

export const Demo: StoryObj<StoryProps> = {
  render: ({ papId, aiplHomeUrl, ...args }) => (
    <AiplComponentProvider
      config={{ ...mockConfig, papId, homeUrl: aiplHomeUrl }}
    >
      <GreeterDemo {...args} />
    </AiplComponentProvider>
  ),
  args: {
    papId: mockConfig.papId,
    aiplHomeUrl: mockConfig.homeUrl,
  },
};
