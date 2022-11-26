import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedNodeState, toggleDynamicState } from "../data/recoil-state";

const DetailsPanel = ({setData}) => {
  const [testTxt, setTestTxt] = useState("");
  const selectedNode = useRecoilValue(selectedNodeState);
  const setIsDynamic = useSetRecoilState(toggleDynamicState);
  const logo = require("../data/pyeadCrab.png");

  const onToggleDynamic = (e) => {
    setIsDynamic(e.target.checked);
  };

  const handleUpdateClick = () => {
    delete require.cache[require.resolve("../data/tempData.json")];
    const tempData = require("../data/tempData.json");

    setData(tempData);
    setTestTxt("JSONs found");
  }

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
        <img id="pyeadCrab" src={logo} width="50vw" alt="logo" />
        <h1>pyeadCrab</h1>
      </div>
      <br />
      <hr />
      <Form>
        <div className="loader" >
          <Button 
            variant="primary"
            onClick={handleUpdateClick}
          >
            Update
          </Button>
          <p id="status">{testTxt}</p>
        </div>
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
  