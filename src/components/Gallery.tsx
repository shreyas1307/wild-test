import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { imageAPIData } from "../interfaces/imageAPI";
import { imagesJSON } from "../images";
import Slider from "./Slider/Slider";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import "./Gallery.css";
import SliderTracker from "./Slider/SliderTracker";
import Button from "./Button/Button";

gsap.registerPlugin(Draggable, InertiaPlugin);
let snapValue: number = 0;
const Gallery: React.FC = () => {
  // State values for Counter, Size, Snap Array and Index for Drag and view Width
  const [counter, setCounter] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [snapping, setSnapping] = useState<boolean>(false);
  const [snapArray, setSnapArray] = useState<number[]>([]);
  const [viewWidth, setWiewWidth] = useState<number>(0);

  // Referencing the Image slider carousel
  const sliderRef = useRef<null | any>(null);

  // Storing style for the Image slider carousel
  const [imageCarouselSlideStyle, setImageCarouselSlideStyle] = useState<{
    transform: string;
    transition: string;
  }>({
    transform: "",
    transition: "",
  });

  // Add an eventlistener to the Window, and dynamically update state value for imageWidth when there is a change in screen size
  useLayoutEffect(() => {
    setImageWidthHandler(window.outerWidth);
    window.addEventListener("resize", (x) => {
      setImageWidthHandler(window.outerWidth);
    });
  }, []);

  // Function which handles setting the image width
  function setImageWidthHandler(width: number) {
    if (width !== undefined) {
      if (window.outerWidth > 590) {
        setWiewWidth(590);
      } else {
        setWiewWidth(window.outerWidth);
      }
    }
  }

  // Synchronously sets Image Width Size and also creates new gsap Draggable instance
  useEffect(() => {
    const imageSize = document.querySelectorAll(".image-carousel-slide img");
    setSize(imageSize[0].clientWidth);

    setImageCarouselSlideStyle((prev) => ({
      ...prev,
      transform: `translateX(${-size * counter}px)`,
    }));
  }, [counter, size]);

  useLayoutEffect(() => {
    let xImageSize: number = 0;
    let arr: number[] = [];

    // Grabs the clientwidth for the image-slider div, and calculates the snap values to be saved for the drag feature
    requestAnimationFrame(() => {
      if (
        sliderRef.current.children[0].clientWidth > 0 &&
        snapArray.length === 0
      ) {
        xImageSize = sliderRef.current.children[0].clientWidth;
        imagesJSON.forEach((d, index: number) => {
          if (index === 0) {
            arr.push(0);
          } else {
            arr.push(-xImageSize * index);
          }
        });
        setSnapArray(arr);
      }
    });

    // Creates a draggable instance of the image slider

    Draggable.create(sliderRef.current, {
      type: "x",
      inertia: true,
      dragResistance: 0,
      edgeResistance: 1,
      throwResistance: 0,
      onDragStart: function () {
        setSnapping(false);
      },
      onDragEnd: function () {
        setSnapping(false);
      },
      snap: {
        left: function (endValue) {
          if (!snapping) {
            setSnapping(true);
            let lastEndValue = snapArray[snapValue];
            if (endValue < lastEndValue && snapValue < snapArray.length - 1) {
              snapValue++;
              setCounter((prev) => prev + 1);
            } else if (endValue > lastEndValue && snapValue > 0) {
              snapValue--;
              setCounter((prev) => prev - 1);
            } else {
            }
          }
          return snapArray[snapValue];
        },
      },
      overshootTolerance: 0,
      activeCursor: "grabbing",
      resistance: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderRef.current, snapArray]);

  // Handles Previous Button clicks

  const prevButtonHandler = () => {
    if (counter === 0) {
      return;
    } else {
      snapValue = snapValue - 1;
      setCounter(counter - 1);
      gsap.to(".image-carousel-slide", {
        transform: `translateX${-size * snapValue}px`,
      });
    }
  };

  // Handles Next Button clicks
  const nextButtonHandler = () => {
    if (counter === imagesJSON.length - 1) {
      return;
    } else {
      snapValue = snapValue + 1;
      setCounter(counter + 1);
      gsap.to(".image-carousel-slide", {
        transform: `translateX${-size * snapValue}px`,
      });
    }
  };

  return (
    <>
      <div
        className="image-carousel-container"
        id="imageContainer"
        style={{
          width: window.outerWidth > 590 ? 590 : window.outerWidth,
        }}
      >
        <div
          className="image-carousel-slide"
          style={imageCarouselSlideStyle}
          ref={sliderRef}
        >
          {imagesJSON.map((data: imageAPIData, index: number) => {
            return <Slider key={index} imageAPIData={data} width={viewWidth} />;
          })}
        </div>
        <Button
          counter={snapValue}
          prevButtonHandler={prevButtonHandler}
          nextButtonHandler={nextButtonHandler}
        />
        <SliderTracker counter={snapValue} />
      </div>
    </>
  );
};

export default Gallery;
