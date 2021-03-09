import React, { useLayoutEffect, useState } from "react";
import { imageAPIData } from "../../interfaces/imageAPI";

export interface ISliderProps {
  imageAPIData: imageAPIData;
  width: number;
}

// The Image Slider Component

const Slider: React.FC<ISliderProps> = ({
  imageAPIData,
  width,
}: ISliderProps) => {
  // Extracting the keys from the Image Data from props.
  const { author, path, id } = imageAPIData;

  return (
    <div>
      <img
        id={`${id}`}
        style={{
          width: width,
          height: "auto",
        }}
        src={path}
        alt={author}
      />
    </div>
  );
};

export default Slider;
