import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { getAnalysis } from "../data/api";

const DetailsPanel = ({setData}) => {
  const [isLoading, setLoading] = useState(false);
  const [testTxt, setTestTxt] = useState("");

  useEffect(() => {
    if (isLoading) {
      getAnalysis().then((resJSON) => {
        setLoading(false);
        if (resJSON) {
          // TODO: Replace with setData when we have a json
          setTestTxt(resJSON["message"]);
        } else {
          return "No response JSON";
        }
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <div className="details-panel">
      <Button 
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
      >
        {isLoading ? "Loading…" : "Start"}
      </Button>
      <br/>
      <br/>
      <p>{testTxt}</p>
    </div>
  );
}

export default DetailsPanel;
  