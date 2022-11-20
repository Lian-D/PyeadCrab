import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { heightState, highlightLinkState, highlightNodeState, selectedNodeState, toggleDynamicState, widthState } from "../data/recoil-state";
import DynamicGraph from "./DynamicGraph";
import StaticGraph from "./StaticGraph";

const GraphPanel = ({data}) => {
  const [colours, setColours] = useState({});
  const [highlightNodes, setHighlightNodes] = useRecoilState(highlightNodeState);
  const [highlightLinks, setHighlightLinks] = useRecoilState(highlightLinkState);
  const selectedNode = useRecoilValue(selectedNodeState);
  const isDynamic = useRecoilValue(toggleDynamicState);
  const setWidth = useSetRecoilState(widthState);
  const setHeight = useSetRecoilState(heightState);
  const setSelectedNode = useSetRecoilState(selectedNodeState);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeClick = (node, type) => {
    highlightNodes.clear();
    highlightLinks.clear();
    
    highlightNodes.add(node);
    if (type === "static") {
      data.staticGraph.links.forEach(link => {
        if (link.source.id === node.id) {
          highlightLinks.add(link);
        }
      });
    } else {
      data.dynamicGraph.links.forEach(link => {
        if (link.source.id === node.id) {
          highlightLinks.add(link);
        }
      });
    }
    
    setSelectedNode(node ? {...node} : null);
    updateHighlight();
  };

  const handleLinkClick = link => {
    highlightNodes.clear();
    highlightLinks.clear();
    setSelectedNode(null);

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  useEffect(() => {
    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    };

    const getColor = (classes) => {
      let colourMapping = {};
      let totalColours = (classes.length > 1) ? classes.length : 1;
      let hueSection = 360 / totalColours;

      let h,s,l;
      classes.forEach((c, index) => {
        h = (index * hueSection) + getRandomInt(hueSection * 0.8);
        s = Math.max(getRandomInt(100), 20); 
        s = Math.min(s, 90); 
        l = Math.max(getRandomInt(100), 20); 
        l = Math.min(l, 80); 
        colourMapping[c] = `hsl(${h} ${s}% ${l}%)`;
      });
      
      return colourMapping;
    };

    let classes = [...new Set(data.staticGraph.nodes.map(n => n.class))];
    setColours(getColor(classes));
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

  const nodePointerArea = (node, color, ctx) => {
      const bckgDimensions = node.__bckgDimensions;
      if (highlightNodes.has(node)) {
        ctx.fillStyle = "rgba(255, 255, 100, 0.8";
        if (selectedNode && node.id === selectedNode.id) {
          ctx.fillStyle = "rgba(100, 255, 100, 0.8";
        }
        ctx.beginPath();
        ctx.ellipse(node.x, node.y, bckgDimensions + 3, bckgDimensions + 3, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(node.x, node.y, bckgDimensions, bckgDimensions , 0, 0, 2 * Math.PI);
      ctx.fill();
  }

  const drawText = (node, ctx, text, fontSize) => {
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

  return (
    <>
    {!isDynamic && 
      <StaticGraph 
        data={data.staticGraph}
        colours={colours}
        handleLinkClick={handleLinkClick}
        handleNodeClick={handleNodeClick}
        drawText={drawText}
        nodePointerArea={nodePointerArea}
      />
    }
    {isDynamic && 
      <DynamicGraph 
        data={data.dynamicGraph}
        colours={colours}
        handleLinkClick={handleLinkClick}
        handleNodeClick={handleNodeClick}
        drawText={drawText}
        nodePointerArea={nodePointerArea}
      />}
    </>
  );
}
  
export default GraphPanel;
  