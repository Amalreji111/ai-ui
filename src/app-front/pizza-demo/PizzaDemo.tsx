import styled from "@emotion/styled";
import { AiplChatButton } from "../../aipl-components/AiplChatButton";
import { AiplInput } from "../../aipl-components/AiplInput";
import { AiplRadioGroup } from "../../aipl-components/AiplRadioGroup";
import { AiplSelect } from "../../aipl-components/AiplSelect";

export const PizzaContainer = styled.div`
  .container {
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    margin-left: 10ch;
  }

  .group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 0.3em;
    margin-top: 0.5em;
  }

  .video {
    top: 1em;
    right: 1em;
    position: absolute;
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
  }

  .instruction {
    text-align: center;
    bottom: 10em;
    right: 10em;
    position: absolute;
  }

  h1 {
    text-align: center;
    color: #d35400;
  }

  label {
    display: block;
    margin-top: 10px;
  }

  select,
  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .radio-group {
    display: flex;
    justify-content: space-around;
    margin-top: 5px;
  }

  fieldset {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: none;
  }

  fieldset label {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  button {
    background-color: #d35400;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
  }

  button:hover {
    background-color: #e67e22;
  }

  .order-summary {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: black;
    color: white;
  }
`;

export const PizzaDemo = () => {
  return (
    <div>
      <PizzaContainer>
        <div className="container">
          <h1>Order Your Pizza</h1>
          <div className="group">
            <label htmlFor="size">Choose Size</label>
            <AiplSelect aiplName="size" />
          </div>
          <div className="group">
            <label htmlFor="crust">Choose Crust</label>
            <AiplSelect aiplName="crust" />
          </div>
          <div className="group">
            <label>Cheese</label>
            <AiplRadioGroup aiplName="cheeseKind" />
          </div>
          <div className="toppings">
            <label>Choose Toppings</label>
            <div className="group">
              Pepperoni
              <AiplInput type="checkbox" aiplName="toppings[pepperoni]" />
              <AiplRadioGroup aiplName="peperoniSegment" />
            </div>
            <div className="group">
              Mushrooms
              <AiplInput type="checkbox" aiplName="toppings[mushrooms]" />
              <AiplRadioGroup aiplName="mushroomsSegment" />
            </div>
            <div className="group">
              Onions
              <AiplInput type="checkbox" aiplName="toppings[onions]" />
              <AiplRadioGroup aiplName="onionsSegment" />
            </div>
            <div className="group">
              Sausage
              <AiplInput type="checkbox" aiplName="toppings[sausage]" />
              <AiplRadioGroup aiplName="sausageSegment" />
            </div>
            <div className="group">
              Bacon
              <AiplInput type="checkbox" aiplName="toppings[bacon]" />
              <AiplRadioGroup aiplName="baconSegment" />
            </div>
          </div>
          <div>Special Instructions</div>

          <AiplInput aiplName="specialInstructions" />
          <button>Place Order</button>
        </div>
      </PizzaContainer>
      <AiplChatButton />
    </div>
  );
};
