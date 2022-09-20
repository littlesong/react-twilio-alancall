import React, { useState } from "react";
import Table from 'react-bootstrap/Table';

export default function ImportCsv() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [header, setHeader] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",").map(i=>i?.replace(/^"(.*)"$/, '$1'));
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    const array = csvRows.map(i => i.split(",").map(i=>i?.replace(/^"(.*)"$/, '$1')));

    setHeader(csvHeader);
    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <h1>REACTJS CSV IMPORT EXAMPLE </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>

      <br />

      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr key={"header"}>
            {header.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) => (
            <tr key={item[0]}>
              {item.map((val) => (
                <td key={val}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
