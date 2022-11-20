import React, { useEffect, useRef } from "react";
import ForceGraph2D from 'react-force-graph-2d';

const StaticGraph = ({data, colours, width, height}) => {
    const graphRef = useRef();

    const minLinkLength = 220;
    const defaultNodeSize = 40;

    useEffect(() => {
        graphRef.current.d3Force('link')
        .distance(() => minLinkLength);
    }, []);

    const drawNode = (node, ctx, globalScale) => {
        node.__bckgDimensions = defaultNodeSize; // to re-use in nodePointerAreaPaint
        const text = node.id;
        let area = defaultNodeSize * 0.3;

        const fontSize = area * 10 / text.length;
        ctx.font = `${fontSize}px Verdana`;

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
    };

    const nodePointerArea = (node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        ctx.beginPath();
        ctx.ellipse(node.x, node.y, bckgDimensions, bckgDimensions , 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    return (
        <ForceGraph2D 
            ref={graphRef}
            width={width}
            height={height}
            graphData={data}
            linkDirectionalArrowLength={15}
            linkDirectionalArrowRelPos={1}
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={nodePointerArea}
            linkColor={() => "gray"}
            autoPauseRedraw={false}
            nodeVal={node => node.__bckgDimensions * 2.5}
        />
    );
}
  
export default StaticGraph;
  