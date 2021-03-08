import React from "react";
import { imagesJSON } from "../../images";

import ArrowSVG from "../../assets/images/arrow.svg";

interface IButtonProps {
  counter: number;
  nextButtonHandler: () => void;
  prevButtonHandler: () => void;
}

// Button Component for the Image slider
const Button: React.FC<IButtonProps> = ({
  counter,
  prevButtonHandler,
  nextButtonHandler,
}) => {
  return (
    <div id="button-wrapper">
      <button
        disabled={counter === 0 ? true : false}
        className="previousButton"
        onClick={prevButtonHandler}
      >
        <img src={ArrowSVG} alt="arrow" />
      </button>
      <button
        disabled={counter === imagesJSON.length - 1 ? true : false}
        className="nextButton"
        onClick={nextButtonHandler}
      >
        <img src={ArrowSVG} alt="arrow" />
      </button>
    </div>
  );
};

export default Button;
