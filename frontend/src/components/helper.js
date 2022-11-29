const minNodeRadius = 100
const maxNodeRadius = 300
const minLinkLength = 3 * maxNodeRadius;
const maxLinkLength = 2 * minLinkLength;

const maxNodeCalls = (data) => data.nodes.reduce(
  (accumulator, currentValue) => Math.max(accumulator, currentValue.calls),
  0
);
const minNodeCalls = (data) => data.nodes.reduce(
  (accumulator, currentValue) => Math.min(accumulator, currentValue.calls),
  Infinity
);
const maxLinkCalls = (data) => data.links.reduce(
  (accumulator, currentValue) => Math.max(accumulator, currentValue.calls),
  0
);

export {
  minNodeRadius,
  maxNodeRadius,
  minLinkLength,
  maxLinkLength,
  maxNodeCalls,
  minNodeCalls,
  maxLinkCalls
};