import React from "react";
import { imagesJSON } from "../../images";
import { imageAPIData } from "../../interfaces/imageAPI";

interface ISliderTrackerProps {
  counter: number;
}

// The Slider tracker on the Image slider, which  shows the current progress in the slider based on the image active.

const SliderTracker: React.FC<ISliderTrackerProps> = ({ counter }) => {
  return (
    <div className="slidertracker">
      {imagesJSON.map((data: imageAPIData, index: number) => {
        return (
          <div
            key={index}
            className="slide"
            style={{
              background: index <= counter ? "white" : "grey",
              left: index <= counter ? "10px" : "40px",
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default SliderTracker;
