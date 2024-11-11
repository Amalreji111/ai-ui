import { TypeBoxes } from "@mjtdev/engine";
import type { AiplComponentContextConfig } from "../../aipl-components/AiplComponentContextState";

export const greeterDemoConfig: Partial<AiplComponentContextConfig> = {
  typeInfo: TypeBoxes.createTypeInfo((Type) => {
    return Type.Object(
      {
        size: Type.Union([
          Type.Literal("small"),
          Type.Literal("medium"),
          Type.Literal("large"),
        ]),
        crust: Type.Union([
          Type.Literal("thin"),
          Type.Literal("thick"),
          Type.Literal("stuffed"),
        ]),
        cheeseKind: Type.Union([
          Type.Literal("light"),
          Type.Literal("normal"),
          Type.Literal("extra"),
        ]),
        toppings: Type.Array(
          Type.Union([
            Type.Literal("pepperoni"),
            Type.Literal("mushrooms"),
            Type.Literal("onions"),
            Type.Literal("sausage"),
            Type.Literal("bacon"),
          ])
        ),
        peperoniSegment: Type.Union([
          Type.Literal("whole"),
          Type.Literal("left"),
          Type.Literal("right"),
        ]),
        mushroomsSegment: Type.Union([
          Type.Literal("whole"),
          Type.Literal("left"),
          Type.Literal("right"),
        ]),
        onionsSegment: Type.Union([
          Type.Literal("whole"),
          Type.Literal("left"),
          Type.Literal("right"),
        ]),
        sausageSegment: Type.Union([
          Type.Literal("whole"),
          Type.Literal("left"),
          Type.Literal("right"),
        ]),
        baconSegment: Type.Union([
          Type.Literal("whole"),
          Type.Literal("left"),
          Type.Literal("right"),
        ]),
        specialInstructions: Type.String(),
      },
      { $id: "Greeter" }
    );
  }),
};
