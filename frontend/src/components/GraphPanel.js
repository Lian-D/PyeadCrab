import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from 'react-force-graph-2d';

const GraphPanel = ({data}) => {
    const [width, setWidth] = useState(window.innerWidth * 0.8);
    const [height, setHeight] = useState(window.innerHeight);
    const [colours, setColours] = useState({});
    const graphRef = useRef();

    const minLinkLength = 100;
    const maxLinkLength = 600;
    useEffect(() => {
        const graph = graphRef.current;
        graph.d3Force('link')
        .distance(link => {
            // scales depending on calls between max and min length
            return minLinkLength + (1/link.calls) * (maxLinkLength - minLinkLength);
        });
    }, []);

    useEffect(() => {
      let classes = [...new Set(data.nodes.map(n => n.class))];
      let colourMapping = {};
      classes.forEach(c => {
        colourMapping[c] = getColor();
      });
      setColours(colourMapping);
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

    const drawNode = (node, ctx, globalScale) => {
        const text = node.id;
        const fontSize = 12 * (1 + node.calls/2);
        ctx.font = `${fontSize}px Verdana`;
        const textWidth = ctx.measureText(text).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n * 0.75 + fontSize * 0.2); // some padding

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint

        nodePointerArea(node, colours[node.class], ctx)

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "white";
        ctx.strokeText(text, node.x, node.y);
        ctx.fillText(text, node.x, node.y)

        if (node.class != null) {
            ctx.font = `${fontSize - 4}px Verdana`;
            const classLabel = node.class;
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
        ctx.ellipse(node.x, node.y, bckgDimensions[0], bckgDimensions[1] * 2 , 0, 0, 2 * Math.PI);
        ctx.fill();
    };
  
    const getColor = () => '#' + Math.floor((Math.random() * 16777215)).toString(16);

    return (
        <ForceGraph2D 
            ref={graphRef}
            width={width}
            height={height}
            graphData={data}
            linkDirectionalArrowLength={10}
            linkDirectionalArrowRelPos={0.7}
            nodeAutoColorBy="group"
            linkLabel="calls"
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={nodePointerArea}
            linkColor={() => "gray"}
        />
    );
  }
  
export default GraphPanel;
  