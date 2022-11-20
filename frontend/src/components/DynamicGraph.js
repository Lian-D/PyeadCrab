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

  useEffect(() => {
    graphRef.current.d3Force('link')
    .distance(link => {
        // scales depending on calls between max and min length
        let length = minLinkLength + (1/link.calls) * (maxLinkLength - minLinkLength);
        link.length = length;
        return length;
    });
  }, []);

  const drawNode = (node, ctx) => {
      const text = node.id;
      const fontSize = 10 * (1 + node.calls/2);
      ctx.font = `${fontSize}px Verdana`;
      const textWidth = ctx.measureText(text).width
      const bckgDimensions = textWidth * 0.75 + fontSize * 0.2; // some padding

      node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint

      nodePointerArea(node, colours[node.class], ctx);

      drawText(node, ctx, text, fontSize);

      const calls = "calls: " + node.calls;
      ctx.font = `${fontSize - 8}px Verdana`;
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
  