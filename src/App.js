import React, {useState} from 'react';
import FormPage from './components/FormPage/FormPage';
// These will be local to the project
import sampleUISchema from './sample/sampleUISchema.js';

function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const switchPage = () => {
    if (currentPage === 0) {
      setCurrentPage(1);
    } else {
      setCurrentPage(0);
    }
  }

  return (
    <div className="App" margin="20px">
      {(currentPage === 0) ? 
        (<FormPage
          index={0}
          schemaEndpoint="https://comt.s3.amazonaws.com/schema/"
          schemas={{
            "wms-a": {
              "schema": "wms",
              "include": ["layer", "style"]
            },
            "comt": {
              "schema": "comt",
              "include": ["project", "subproject", "model"]
            },
          }}
          dataApiEndpoint="http://localhost:8888/api/"
          uiSchema={sampleUISchema}
        />) :
        (<FormPage
          index={1}
          schemaEndpoint="https://comt.s3.amazonaws.com/schema/"
          schemas={{
            "wms-b": {
              "schema": "wms",
              "include": ["opacity", "transparent", "elevation"]
            },
          }}
          dataApiEndpoint="http://localhost:8888/api/"
          uiSchema={sampleUISchema}
        />)
      }
      <button
        onClick={() => switchPage()}
      >
        Other Page
      </button>
    </div>
  );
}

export default App;
