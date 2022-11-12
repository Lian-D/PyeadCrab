import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const DetailsPanel = () => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      //temporary to test out some stuff, replace this with call to backend later
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <div className="details-panel">
      <p>temp text</p>
      <Button 
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
      >
        {isLoading ? "Loading…" : "Start"}
      </Button>
    </div>
  );
}

export default DetailsPanel;
  