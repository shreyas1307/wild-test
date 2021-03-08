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

const Gallery: React.FC = () => {
  // State values for Counter, Size
  const [counter, setCounter] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [snapping, setSnapping] = useState<boolean>(false);
  const [snapArray, setSnapArray] = useState<number[]>([]);
  const sliderRef = useRef<null | any>(null);
  let snapValue: number = 0;

  const [imageCarouselSlideStyle, setImageCarouselSlideStyle] = useState<{
    transform: string;
    transition: string;
  }>({
    transform: "",
    transition: "",
  });

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

            if (
              endValue < lastEndValue + 56 &&
              snapValue < snapArray.length - 1
            ) {
              snapValue++;
              setCounter((prev) => prev + 1);
            } else if (endValue > lastEndValue - 56 && snapValue > 0) {
              snapValue--;
              setCounter((prev) => prev - 1);
            }
          }
          return snapArray[snapValue];
        },
      },
      overshootTolerance: 0,
      activeCursor: "grabbing",
      resistance: 1,
    });
  }, [sliderRef.current, snapArray]);

  const prevButtonHandler = () => {
    if (counter === 0) {
      return;
    } else {
      snapValue--;
      setCounter(counter - 1);
      gsap.to(".image-carousel-slide", {
        transform: `translateX${-size * counter}px`,
      });
    }
  };
  const nextButtonHandler = () => {
    if (counter === imagesJSON.length - 1) {
      return;
    } else {
      setCounter(counter + 1);
      snapValue++;
      gsap.to(".image-carousel-slide", {
        transform: `translateX${-size * counter}px`,
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
            return <Slider key={index} imageAPIData={data} />;
          })}
        </div>
        <Button
          counter={counter}
          prevButtonHandler={prevButtonHandler}
          nextButtonHandler={nextButtonHandler}
        />
        <SliderTracker counter={counter} />
      </div>
    </>
  );
};

export default Gallery;
