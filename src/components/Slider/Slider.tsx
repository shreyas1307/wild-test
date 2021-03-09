import React, { useLayoutEffect, useState } from "react";
import { imageAPIData } from "../../interfaces/imageAPI";

export interface ISliderProps {
  imageAPIData: imageAPIData;
}

// The Image Slider Component

const Slider: React.FC<ISliderProps> = ({ imageAPIData }: ISliderProps) => {
  // Storing the client width in state
  const [imageWidth, setImageWidth] = useState<number>(0);

  // Extracting the keys from the Image Data from props.
  const { author, path, id } = imageAPIData;

  // Add an eventlistener to the Window, and dynamically update state value for imageWidth when there is a change in screen size
  useLayoutEffect(() => {
    setImageWidthHandler();
    window.addEventListener("resize", setImageWidthHandler);
  }, []);

  // Function which handles setting the image width
  function setImageWidthHandler() {
    if (window.outerWidth > 590) {
      setImageWidth(590);
    } else {
      setImageWidth(window.outerWidth);
    }
  }

  return (
    <div>
      <img
        id={`${id}`}
        style={{
          width: imageWidth,
          height: "auto",
        }}
        src={path}
        alt={author}
      />
    </div>
  );
};

export default Slider;
