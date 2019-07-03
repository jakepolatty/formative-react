import React, {useState} from 'react';
import FormPage from './components/FormPage/FormPage';
import Button from 'react-bootstrap/Button';
// These will be local to the project
import sampleUISchema from './sample/sampleUISchema.js';
import './sample/sampleCSS.css';

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = [
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
    />),
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
    />),
    (<FormPage
      index={2}
      schemaEndpoint="https://comt.s3.amazonaws.com/schema/"
      schemas={{
        "comt": {
          "schema": "comt",
          "include": ["subproject", "model"]
        },
      }}
      dataApiEndpoint="http://localhost:8888/api/"
      uiSchema={sampleUISchema}
    />),
    (<FormPage
      index={3}
      schemaEndpoint="https://comt.s3.amazonaws.com/schema/"
      schemas={{
        "wms": {
          "schema": "wms",
          "include": ["layer", "style", "opacity", "transparent", "elevation"]
        },
      }}
      dataApiEndpoint="http://localhost:8888/api/"
      uiSchema={{}}
    />),
    // (<FormPage
    //   index={0}
    //   schemaEndpoint="https://project-open-data.cio.gov/v1.1/schema/"
    //   schemas={{
    //     "dataset": {
    //       "schema": "dataset",
    //       "include": ["accessLevel", "theme", "dataQuality", "issued"]
    //     }
    //   }}
    //   dataApiEndpoint="http://localhost:8888/api/"
    //   uiSchema={{}}
    // />),
    // (<FormPage
    //   index={1}
    //   schemaEndpoint="https://project-open-data.cio.gov/v1.1/schema/"
    //   schemas={{
    //     "dataset": {
    //       "schema": "dataset",
    //       "include": ["rights", "describedBy", "describedByType"]
    //     },
    //   }}
    //   dataApiEndpoint="http://localhost:8888/api/"
    //   uiSchema={{
    //     "dataset": {
    //       "rights": {
    //         "ui:component": "SelectInput",
    //         "options": ["a", "b", "c"]
    //       }
    //     }
    //   }}
    // />)
  ];

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div className="App" margin="20px">
      {pages[currentPage]}
      <Button
        onClick={() => prevPage()}
        disabled={currentPage === 0}
        variant={currentPage === 0 ? "light" : "primary"}
      >
        Previous Page
      </Button>
      <Button
        onClick={() => nextPage()}
        disabled={currentPage === pages.length - 1}
        variant={currentPage === pages.length - 1 ? "light" : "primary"}
      >
        Next Page
      </Button>
      <p>Page {currentPage + 1}</p>
    </div>
  );
}

export default App;
