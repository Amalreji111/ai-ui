import { useEffect } from "react";
import { AiplComponentProvider } from "../../provider/AiplComponentProvider";
import { hideLoadingScreen } from "../../ui/hideLoadingScreen";
import { PizzaDemo } from "./PizzaDemo";
import { pizzaDemoConfig } from "./pizzaDemoConfig";

export const PizzaDemoFront = () => {
  useEffect(() => {
    hideLoadingScreen();
  }, []);

  return (
    <AiplComponentProvider config={pizzaDemoConfig}>
      <PizzaDemo />
    </AiplComponentProvider>
  );
};
