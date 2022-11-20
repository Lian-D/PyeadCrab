import React, { useEffect, useRef } from "react";
import ForceGraph2D from 'react-force-graph-2d';

const DynamicGraph = ({data, colours, width, height}) => {
    const graphRef = useRef();

    const minLinkLength = 100;
    const maxLinkLength = 600;

    useEffect(() => {
      graphRef.current.d3Force('link')
      .distance(link => {
          // scales depending on calls between max and min length
          return minLinkLength + (1/link.calls) * (maxLinkLength - minLinkLength);
      });
    }, []);

    const drawNode = (node, ctx, globalScale) => {
        const text = node.id;
        const fontSize = 12 * (1 + node.calls/2);
        ctx.font = `${fontSize}px Verdana`;
        const textWidth = ctx.measureText(text).width
        // in case we still want the narrow bubbles:
        // const bckgDimensions = [textWidth, fontSize].map(n => n * 0.75 + fontSize * 0.2); // some padding
        const bckgDimensions = textWidth * 0.75 + fontSize * 0.2; // some padding

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint

        nodePointerArea(node, colours[node.class], ctx);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "white";
        ctx.strokeText(text, node.x, node.y);
        ctx.fillText(text, node.x, node.y)

        if (node.class !== "none") {
            ctx.font = `${fontSize - 4}px Verdana`;
            const classLabel = node.class;
            ctx.strokeText(classLabel, node.x, node.y - fontSize);
            ctx.fillText(classLabel, node.x, node.y - fontSize);
        }

        const calls = "calls: " + node.calls;
        ctx.font = `${fontSize - 8}px Verdana`;
        ctx.strokeText(calls, node.x, node.y + fontSize);
        ctx.fillText(calls, node.x, node.y + fontSize)
    };

    const nodePointerArea = (node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        ctx.beginPath();
        // in case we still want the narrow bubbles:
        // ctx.ellipse(node.x, node.y, bckgDimensions[0], bckgDimensions[1] * 2 , 0, 0, 2 * Math.PI)
        ctx.ellipse(node.x, node.y, bckgDimensions, bckgDimensions , 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    return (
        <ForceGraph2D 
            ref={graphRef}
            width={width}
            height={height}
            graphData={data}
            linkDirectionalArrowLength={20}
            linkDirectionalArrowRelPos={0.5}
            linkLabel="calls"
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={nodePointerArea}
            linkColor={() => "gray"}
            autoPauseRedraw={false}
            nodeVal={node => node.__bckgDimensions * 4}
        />
    );
  }
  
export default DynamicGraph;
  