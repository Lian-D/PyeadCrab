import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import DetailsPanel from "./components/DetailsPanel";
import GraphPanel from "./components/GraphPanel";
import tempData from "./data/tempData.json"; //temp until we get data from the backend

function App() {
  const [data, setData] = useState({
    nodes: [],
    links: [] 
  });

  useEffect(() => {
    let i = 0;
    let newNodes = tempData.nodes.map(n => {
        return {
            ...n,
            number: i++
        }
    });
    tempData.nodes = newNodes;
    setData(tempData);
  }, []);

  return (
    <div className="App">
      <div className="content">
        <GraphPanel data={data}/>
        <DetailsPanel setData={setData}/>
      </div>
    </div>
  );
}

export default App;
