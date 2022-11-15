import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from 'react-force-graph-2d';

const GraphPanel = ({data}) => {
    const [width, setWidth] = useState(window.innerWidth * 0.8);
    const [height, setHeight] = useState(window.innerHeight);
    const [colours, setColours] = useState({});
    const graphRef = useRef();

    useEffect(() => {
        const graph = graphRef.current;
        graph.d3Force('link')
        .distance(link => {
          let dis = ((1 / link.calls) + 1) * 100
          link.dis = dis;
          return dis;
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
        const fontSize = 12/globalScale * (1 + node.calls/2);
        ctx.font = `${fontSize}px Verdana`;
        const textWidth = ctx.measureText(text).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n * 0.75 + fontSize * 0.2); // some padding

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint

        nodePointerArea(node, colours[node.class], ctx)

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
            nodeLabel="calls"
            linkLabel={"calls"}
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={nodePointerArea}
            linkColor={() => "gray"}
        />
    );
  }
  
export default GraphPanel;
  