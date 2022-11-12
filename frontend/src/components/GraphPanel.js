import React, { useEffect, useState } from "react";
import ForceGraph2D from 'react-force-graph-2d';

const GraphPanel = ({type, data}) => {
    const [width, setWidth] = useState(window.innerWidth * 0.7);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
      const changeSize = () => {
        setWidth(window.innerWidth * 0.7);
        setHeight(window.innerHeight);
      }
    
      window.addEventListener('resize', changeSize)

      return function cleanup() {
        window.removeEventListener('resize', changeSize);
    };
    });

    const drawCircle = (node, ctx) => {
        circlePointerArea(node, getColor(node.number), ctx);
    };

    const circlePointerArea = (node, color, ctx) => {
        ctx.fillStyle = color;
        ctx.beginPath(); 
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
        ctx.fill();
    };

    const drawText = (node, ctx, globalScale) => {
        const text = node.id;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(text).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.color;
        ctx.fillText(text, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    };

    const textPointerArea = (node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    };
  
    // gen a number persistent color from around the palette
    const getColor = n => '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');

    const drawFn = type === "circle" ? drawCircle : drawText;
    const pointerFn = type === "circle" ? circlePointerArea : textPointerArea;

    return (
        <ForceGraph2D 
            width={width}
            height={height}
            graphData={data}
            nodeAutoColorBy="group"
            nodeLabel="id"
            nodeCanvasObject={drawFn}
            nodePointerAreaPaint={pointerFn}
            linkColor={(link) => "gray"}
        />
    );
  }
  
export default GraphPanel;
  