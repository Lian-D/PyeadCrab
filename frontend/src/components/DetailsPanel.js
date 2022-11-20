import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getAnalysis } from "../data/api";
import { selectedNodeState, toggleDynamicState } from "../data/recoil-state";

const DetailsPanel = ({setData}) => {
  const [isLoading, setLoading] = useState(false);
  const [testTxt, setTestTxt] = useState("");
  const setIsDynamic = useSetRecoilState(toggleDynamicState);
  const selectedNode = useRecoilValue(selectedNodeState);
  const logo = require("../data/pyeadCrab.png");

  useEffect(() => {
    delete require.cache[require.resolve("../data/tempData.json")];
    const tempData = require("../data/tempData.json");

    if (isLoading) {
      getAnalysis().then((resJSON) => {
        setLoading(false);

        if (resJSON) {
          setData(tempData);
          setTestTxt("Analysis complete!");
        } else {
          return "No response JSON";
        }
      });
    }
  }, [isLoading, setData]);

  const handleClick = () => {
    setTestTxt("Loading...");
    setLoading(true);
  }

  const onToggleDynamic = (e) => {
    setIsDynamic(e.target.checked);
  };

  const nodeDetails = selectedNode ? 
    <>
      <p>Function: {selectedNode.id}</p>
      <p>Class: {selectedNode.class}</p>
      {selectedNode.hasOwnProperty("calls") && <p>Called: {selectedNode.calls} times</p>}
    </>
    : null;

  return (
    <div className="details-panel">
      <div id="logo" >
        <img src={logo} height="70px" width="70px" alt="logo" />
        <h1>pyeadCrab</h1>
      </div>
      <br />
      <hr />
      <div className="loader" >
        <Button 
          variant="primary"
          disabled={isLoading}
          onClick={!isLoading ? handleClick : null}
        >
          Start
        </Button>
        <br/>
        <br/>
        <p id="status">{testTxt}</p>
      </div>
      <Form>
        <Form.Switch 
          type="switch"
          id="dynamic-graph-switch"
          label="Toggle Dynamic Graph"
          onChange={onToggleDynamic}
        />
      </Form>
      <hr />
      {nodeDetails}
    </div>
  );
}

export default DetailsPanel;
  