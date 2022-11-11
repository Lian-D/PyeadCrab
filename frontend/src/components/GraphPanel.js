import React from "react";
import ForceGraph2D from 'react-force-graph-2d';
import data from "../tempData.json";

const GraphPanel = () => {
    const getData = () => {
        let i = 0;
        let newNodes = data.nodes.map(n => {
            return {
                ...n,
                number: i++
            }
        });
        data.nodes = newNodes;
        return data;
    }

    const onDragEnd = (node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
    };

    const nodeDrawCircle = (node, color, ctx) => {
        ctx.fillStyle = color;
        ctx.beginPath(); 
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
        ctx.fill();
    }

    const nodeDrawText = (node, ctx, globalScale) => {
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
    }

    const nodeTextPointerArea = (node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    };
  
    // gen a number persistent color from around the palette
    const getColor = n => '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');

    return (
        <ForceGraph2D
            graphData={getData()}
            nodeAutoColorBy="group"
	        nodeLabel="id"
            nodeCanvasObject={(node, ctx) => nodeDrawCircle(node, getColor(node.number), ctx)}
            nodePointerAreaPaint={nodeDrawCircle}
            onNodeDragEnd={onDragEnd}
        />
    );
  }
  
export default GraphPanel;
  