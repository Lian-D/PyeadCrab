import React, { useEffect, useState } from "react";
import DynamicGraph from "./DynamicGraph";
import StaticGraph from "./StaticGraph";

const GraphPanel = ({data, isDynamic}) => {
    const [width, setWidth] = useState(window.innerWidth * 0.8);
    const [height, setHeight] = useState(window.innerHeight);
    const [colours, setColours] = useState({});

    useEffect(() => {
      let classes = [...new Set(data.nodes.map(n => n.class))];
      
      const getColor = (classes) => {
        let colourMapping = {};
        let totalColours = (classes.length > 1) ? classes.length : 1;
        let hueSection = 360 / totalColours;

        let h,s,l;
        classes.forEach((c, index) => {
          h = (index * hueSection) + getRandomInt(hueSection * 0.8);
          s = Math.max(getRandomInt(100), 20); // prevent the value from going too low (gray)
          l = Math.max(getRandomInt(100), 20); // prevent the value from going too low (black)
          l = Math.min(l, 80); // prevent the value from going too high (white)
          colourMapping[c] = `hsl(${h} ${s}% ${l}%)`;
        });
        return colourMapping;
      };
      setColours(getColor(classes));
    }, [data]);

    useEffect(() => {
      const changeSize = () => {
        setWidth(window.innerWidth * 0.8);
        setHeight(window.innerHeight);
      }
    
      window.addEventListener('resize', changeSize)

      return function cleanup() {
        window.removeEventListener('resize', changeSize);
      };
    });

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    };

    return (
      <>
      {!isDynamic && <StaticGraph data={data} colours={colours} width={width} height={height} />}
      {isDynamic && <DynamicGraph data={data} colours={colours} width={width} height={height} />}
      </>
    );
  }
  
export default GraphPanel;
  