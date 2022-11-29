import React from "react";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { highlightLinkState, selectedLinkState, selectedNodeState, toggleDynamicState, toggleSimpleState } from "../data/recoil-state";

const DetailsPanel = ({setStaticData, setDynamicData}) => {
  const logo = require("../data/pyeadCrab2.png");
  const selectedNode = useRecoilValue(selectedNodeState);
  const selectedLink = useRecoilValue(selectedLinkState);
  const selectedLinks = useRecoilValue(highlightLinkState);
  const [isDynamic, setIsDynamic] = useRecoilState(toggleDynamicState);
  const setIsSimple = useSetRecoilState(toggleSimpleState);

  const onToggleDynamic = (e) => {
    setIsDynamic(e.target.checked);
  };

  const onToggleSimple = (e) => {
    setIsSimple(e.target.checked);
  };

  const handleUpdateClick = () => {
    delete require.cache[require.resolve("../data/static.json")];
    delete require.cache[require.resolve("../data/dynamic.json")];
    const staticData = require("../data/static.json");
    const dynamicData = require("../data/dynamic.json");

    setStaticData(staticData);
    setDynamicData(dynamicData);
  }

  return (
    <div className="details-panel">
      <div className="header">
        <div id="logo" >
          <img id="pyeadCrab" src={logo} alt="logo" />
          <h1>pyeadCrab</h1>
        </div>
        <hr />
        <Form>
          <div className="loader" >
            <Button 
              variant="primary"
              onClick={handleUpdateClick}
            >
              Update
            </Button>
          </div>
          <Form.Switch 
            type="switch"
            id="dynamic-graph-switch"
            label="Show Dynamic Graph"
            onChange={onToggleDynamic}
          />
          <Form.Switch 
            type="switch"
            id="simple-graph-switch"
            label="Show Simplified Graph"
            onChange={onToggleSimple}
          />
        </Form>
        <hr />
      </div>
      <div className="field-info">
        {selectedNode && 
          <>
            <p>
              Function: {selectedNode.name} <br/>
              Class: {selectedNode.class} <br/>
              Parameters: {selectedNode.params} <br/>
              {isDynamic && 
                <>
                Called: {selectedNode.calls ? selectedNode.calls + " times" : ""} <br/>
                Next calls prediction: 
                </>
              } 
            </p>
            {(isDynamic && selectedLinks.size !== 0) &&
              <Table striped bordered size="sm" variant="dark">
                <thead>
                  <tr>
                    <th>Probability</th>
                    <th>Function</th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedLinks].map((link, i) => {
                    let row = <tr key={i}>
                                <td>{link.probability ? link.probability.toFixed(5) : "N/A"}</td>
                                <td>{`${link.target.class}.${link.target.name}`}</td>
                              </tr>;
                    return row;
                  })}
                </tbody>
              </Table>
            }
          </>
        }
        {selectedLink && 
          <p>
            Link: <br/>
            Caller: {selectedLink.source.name} <br/>
            Callee: {selectedLink.target.name} <br/>
            Probability: {selectedLink.probability ? selectedLink.probability.toFixed(5) : null} <br/>
          </p>
        }
      </div>
    </div>
  );
}

export default DetailsPanel;
  