import React, {
  useEffect,
  useLayoutEffect,
  //  useReducer,
  useRef,
  useState,
} from "react";
import { imageAPIData } from "../interfaces/imageAPI";
import { imagesJSON } from "../images";
import Slider from "./Slider/Slider";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import "./Gallery.css";
import SliderTracker from "./Slider/SliderTracker";
import Button from "./Button/Button";
// import { ImageSliderReducer, useReducerState } from "./useReducer";

gsap.registerPlugin(Draggable, InertiaPlugin);

const Gallery: React.FC = () => {
  // const [state, dispatch] = useReducer(ImageSliderReducer, useReducerState)
  // State values for Counter, Size, Snap Array and Index for Drag and view Width
  const [counter, setCounter] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [snapping, setSnapping] = useState<boolean>(false);
  const [snapArray, setSnapArray] = useState<number[]>([]);
  const [viewWidth, setWiewWidth] = useState<number>(0);

  // Referencing the Image slider carousel
  const sliderRef = useRef<null | any>(null);

  let snapValue: number = 0;

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
  useLayoutEffect(() => {
    const imageSize = document.querySelectorAll(".image-carousel-slide img");
    setSize(imageSize[0].clientWidth);

    setImageCarouselSlideStyle((prev) => ({
      ...prev,
      transform: `translateX(${-size * counter}px)`,
    }));
  }, [counter, size]);

  useEffect(() => {
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
        console.log("Drag Start");
        setSnapping(false);
      },
      onDragEnd: function () {
        console.log("Drag End");
        setSnapping(false);
      },
      onThrowComplete: () => {
        console.log("Throw Complete", snapValue, counter);
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
          console.log(snapValue, "snapValue | Counter", counter);
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
      snapValue--;
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
      setCounter(counter + 1);
      snapValue++;
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
