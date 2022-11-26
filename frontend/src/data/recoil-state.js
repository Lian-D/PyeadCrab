import { atom } from "recoil";

const widthState = atom({
    key: "width",
    default: window.innerWidth * 0.75
});

const heightState = atom({
    key: "height",
    default: window.innerHeight
});

const toggleDynamicState = atom({
  key: "toggleDynamic",
  default: false
});

const highlightNodeState = atom({
  key: "highlightNodes",
  default: new Set()
});

const highlightLinkState = atom({
  key: "highlightLinks",
  default: new Set()
});

const selectedNodeState = atom({
  key: "selectedNode",
  default: null
});

const hselectedLinkState = atom({
  key: "selectedLink",
  default: null
});

export {
    widthState,
    heightState,
    toggleDynamicState,
    highlightNodeState,
    highlightLinkState,
    selectedNodeState,
    hselectedLinkState
};