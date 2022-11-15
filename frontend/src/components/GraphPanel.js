import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from 'react-force-graph-2d';

const GraphPanel = ({type, data}) => {
    const [width, setWidth] = useState(window.innerWidth * 0.8);
    const [height, setHeight] = useState(window.innerHeight);
    const classColours = [...new Set(data.nodes.map(n => n.class))];
    const graphRef = useRef();

    useEffect(() => {
        const graph = graphRef.current;
        graph.d3Force('link')
        .distance(link => link.calls * 50);
    }, []);

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

    const drawNode = (node, ctx, globalScale) => {
        const text = node.id;
        const fontSize = 16/globalScale;
        ctx.font = `${fontSize}px Verdana`;
        const textWidth = ctx.measureText(text).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint

        nodePointerArea(node, getColor(classColours.indexOf(node.class)), ctx)

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4 / globalScale;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, node.x, node.y);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "white";
        ctx.fillText(text, node.x, node.y);
    };

    const nodePointerArea = (node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        ctx.beginPath(); 
        ctx.ellipse(node.x, node.y, bckgDimensions[0], bckgDimensions[1], 0, 0, 2 * Math.PI); 
        ctx.fill();
    };
  
    // gen a number persistent color from around the palette
    const getColor = n => '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');

    return (
        <ForceGraph2D 
            ref={graphRef}
            width={width}
            height={height}
            graphData={data}
	        linkDirectionalArrowLength={10}
	        linkDirectionalArrowRelPos={1}
            nodeAutoColorBy="group"
            nodeLabel="id"
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={nodePointerArea}
            linkColor={() => "gray"}
        />
    );
  }
  
export default GraphPanel;
  