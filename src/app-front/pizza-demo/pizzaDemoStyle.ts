import { css } from "@emotion/react";

export const pizzaDemoStyle = css`
  .container {
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
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

  .pizza h1 {
    text-align: center;
    color: #d35400;
  }

  .pizza label {
    display: block;
    margin-top: 10px;
  }

  .pizza select,
  .pizza input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .pizza .radio-group {
    display: flex;
    justify-content: space-around;
    margin-top: 5px;
  }

  .pizza fieldset {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: none;
  }
  .pizza fieldset label {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pizza button {
    background-color: #d35400;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
  }

  .pizza button:hover {
    background-color: #e67e22;
  }

  .pizza .order-summary {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: black;
    color: white;
  }
`;