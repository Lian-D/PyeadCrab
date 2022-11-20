import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import DetailsPanel from "./components/DetailsPanel";
import GraphPanel from "./components/GraphPanel";
import { RecoilRoot } from 'recoil';

function App() {
  const [data, setData] = useState({
    staticGraph: {
        nodes: [],
        links: [] 
    },
    dynamicGraph: {
        nodes: [],
        links: [] 
    }
  });

  return (
    <div className="App">
      <div className="content">
        <RecoilRoot>
          <GraphPanel data={data}/>
          <DetailsPanel setData={setData}/>
        </RecoilRoot>
      </div>
    </div>
  );
}

export default App;
