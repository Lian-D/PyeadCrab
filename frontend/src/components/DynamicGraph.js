import React, { useEffect, useRef } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import { useRecoilValue } from "recoil";
import { highlightLinkState, widthState, heightState } from "../data/recoil-state";

const DynamicGraph = ({data, colours, handleNodeClick, handleLinkClick, drawText, nodePointerArea}) => {
  const width = useRecoilValue(widthState);
  const height = useRecoilValue(heightState);
  const highlightLinks = useRecoilValue(highlightLinkState);
  const graphRef = useRef();

  const minLinkLength = 100;
  const maxLinkLength = 600;

  const nodeBaseRadius = 100;

  useEffect(() => {
    graphRef.current.d3Force('link')
    .distance(link => {
        // scales depending on calls between max and min length
        // we might want to make these scale relative to the most amount of calls on the nodes
        let length = minLinkLength + (1/link.calls) * (maxLinkLength - minLinkLength);
        link.length = length;
        return length;
    });
  }, []);


  const drawNode = (node, ctx) => {
      const text = node.id;
      const bckgDimensions = nodeBaseRadius + nodeBaseRadius * node.calls / 4;
      // TODO: the above method of scaling for bigger call amounts is kinda jank, more preferably we'd have a max and min value that we'd scale between
      // based on the highest amount and lowest amount of calls that the nodes have

      const textWidth = (2 * bckgDimensions) * 0.8; // we need all of our text to fit in here
      ctx.font = '10px Courier'; // if we want calculations to be accurate, this needs to be a monospace font
      const charTextSizeRatio = 10 / ctx.measureText("a").width
      const fontSize = textWidth / text.length * charTextSizeRatio;
      ctx.font = `${fontSize}px Courier`;

      node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint

      nodePointerArea(node, colours[node.class], ctx);

      drawText(node, ctx, text, fontSize);

      const calls = "calls: " + node.calls;
      ctx.font = `${fontSize * 0.6}px Courier`;
      ctx.strokeText(calls, node.x, node.y + fontSize);
      ctx.fillText(calls, node.x, node.y + fontSize)
  };

  return (
      <ForceGraph2D 
          ref={graphRef}
          width={width}
          height={height}
          graphData={data}
          linkDirectionalArrowLength={15}
          linkDirectionalArrowRelPos={(link) => (link.length - link.target.__bckgDimensions) / link.length}
          linkLabel="calls"
          nodeCanvasObject={drawNode}
          nodePointerAreaPaint={nodePointerArea}
          linkColor={(link) => highlightLinks.has(link) ? "lightyellow" : "gray"}
          linkWidth={(link) => highlightLinks.has(link) ? 2 : 1}
          autoPauseRedraw={false}
          onNodeClick={(node) => handleNodeClick(node, "dynamic")}
          onLinkClick={handleLinkClick}
      />
  );
}
  
export default DynamicGraph;
  