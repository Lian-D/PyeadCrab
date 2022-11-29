import React, { useEffect, useRef } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import {forceCollide} from "d3-force";
import { useRecoilValue } from "recoil";
import { heightState, highlightLinkState, toggleSimpleState, widthState } from "../data/recoil-state";
import { maxNodeRadius, minNodeRadius } from "./helper";

const StaticGraph = ({data, handleLinkClick, handleNodeClick, drawNode, nodePointerArea}) => {
    const width = useRecoilValue(widthState);
    const height = useRecoilValue(heightState);
    const highlightLinks = useRecoilValue(highlightLinkState);
    const isSimpleGraph = useRecoilValue(toggleSimpleState);
    const graphRef = useRef();

    const minLinkLength = 600;

    useEffect(() => {
        graphRef.current.d3Force('link').distance(() => minLinkLength);
        graphRef.current.d3Force('collide', forceCollide(minNodeRadius + maxNodeRadius / 1.5));
    }, []);

    return (
        <ForceGraph2D
            ref={graphRef}
            width={width}
            height={height}
            graphData={data}
            linkDirectionalArrowLength={35}
            linkDirectionalArrowRelPos={1}
            nodeCanvasObject={(node, ctx) => drawNode(node, ctx, data)}
            linkLineDash={[10, 5]}
            nodePointerAreaPaint={nodePointerArea}
            linkColor={(link) => highlightLinks.has(link) ? "yellow" : "lightyellow"}
            linkWidth={(link) => highlightLinks.has(link) ? 2 : 1}
            autoPauseRedraw={false}
            nodeVal={isSimpleGraph ? null : node => node.__bckgDimensions * 2.5}
            onNodeClick={(node) => handleNodeClick(node, data)}
            onLinkClick={handleLinkClick}
        />
    );
}

export default StaticGraph;
