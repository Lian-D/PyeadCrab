import React, { useEffect, useRef } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import {forceCollide} from "d3-force";
import { useRecoilValue } from "recoil";
import { highlightLinkState, widthState, heightState, toggleSimpleState } from "../data/recoil-state";
import { maxLinkCalls, maxLinkLength, maxNodeRadius, minLinkLength, minNodeRadius } from "./helper";

const DynamicGraph = ({data, handleNodeClick, handleLinkClick, drawNode, nodePointerArea}) => {
  const width = useRecoilValue(widthState);
  const height = useRecoilValue(heightState);
  const highlightLinks = useRecoilValue(highlightLinkState);
  const isSimpleGraph = useRecoilValue(toggleSimpleState);
  const graphRef = useRef();

  useEffect(() => {
    graphRef.current.d3Force('collide', forceCollide(minNodeRadius + maxNodeRadius / 2));
  }, []);

  const onTick = () => {
    if (graphRef.current) {
      graphRef.current.d3Force('link')
      .distance(link => {
          // scales depending on calls between max and min length
          // we might want to make these scale relative to the most amount of calls on the nodes
          let length = minLinkLength + (1 - (link.calls / maxLinkCalls(data))) * (maxLinkLength - minLinkLength);
          link.length = length;
          return length;
      });
    }
  }

  const linkArrowPlacement = (link) => {
    return isSimpleGraph ? 1 : (link.length - link.target.__bckgDimensions) / link.length;
  }

  const arrowSize = (link) => {
    return 35 * (link.width / 2);
  }

  const linkWidth = (link) => {
    let width = highlightLinks.has(link) ? 2 : 1;
    width += (4 * link.probability);
    link.width = width;
    return width;
  }

  return (
      <ForceGraph2D 
          ref={graphRef}
          width={width}
          height={height}
          graphData={data}
          linkDirectionalArrowLength={arrowSize}
          linkDirectionalArrowRelPos={linkArrowPlacement}
          linkDirectionalArrowColor={(link) => highlightLinks.has(link) ? "rgb(255,255,0)" : "rgb(230,230,230)"}
          nodeCanvasObject={(node, ctx) => drawNode(node, ctx, data)}
          nodePointerAreaPaint={nodePointerArea}
          linkColor={(link) => highlightLinks.has(link) ? "rgba(255,255,0,0.8)" : "rgba(230,230,230,0.8)"}
          linkWidth={linkWidth}
          autoPauseRedraw={false}
          onNodeClick={(node) => handleNodeClick(node, data)}
          onLinkClick={handleLinkClick}
          onEngineTick={onTick}
      />
  );
}
  
export default DynamicGraph;
  