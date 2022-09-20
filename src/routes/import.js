import React, { useState } from "react";
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

const styles = {
  middle: { marginTop: '20%' },
  center: { textAlign: 'center' }
}

export default function ImportCsv() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [header, setHeader] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
    setArray([]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",").map(i => i?.replace(/^"(.*)"$/, '$1'));
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    const array = csvRows.map(i => i.split(",").map(i => i?.replace(/^"(.*)"$/, '$1')));

    setHeader(csvHeader);
    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
        setLoading(false);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <div>
      <Stack>
        <h5>Import phone numbers from CSV</h5>
        <Form>
        <Stack direction="horizontal" gap={3}>
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
          />
          <div className="ms-auto">
          <Button size="sm" variant="outline-primary" 
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            Import
          </Button>
          </div>
          <Button size="sm" variant="outline-primary"
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            Save
          </Button>
          </Stack>

        </Form>
        </Stack>
      {loading ? <div style={styles.middle}><Spinner animation="border" size="lg" /></div> : (
        (array && array.length > 0) ?
          <Table striped bordered hover responsive size="sm" style={{ marginTop: '10px' }}>
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
          </Table> :
          <div style={styles.middle} >No Data</div>
      )}
    </div>
  );
}
