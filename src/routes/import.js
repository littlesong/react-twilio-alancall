/* eslint-disable no-loop-func */
import React, { useState } from "react";
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { genoReq } from "../utils/restUtil";

const styles = {
  middle: { marginTop: '20%' },
  center: { textAlign: 'center' }
}

export default function ImportCsv() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [header, setHeader] = useState([]);
  const [stcode, setStcode] = useState('KS');
  const [msg, setMsg] = useState(null);
  const [progress, setProgress] = useState();

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
    if (file) {
      setLoading(true);
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
        setLoading(false);
      };

      fileReader.readAsText(file);
    } else {
      setMsg("Please choose a file first.");
    }
  };

  const sendChunk = ( data, ref )=>{
          // POST to geno in chunks
            genoReq("/objs", "post", { objs: data },)
            .then((data) => {
              console.log("Chunk saved:", ref);
              setProgress( data.length+progress );
            }).catch(err => {
              console.error("Chunk failed:", err);
            });
  }

  const handleOnSave = (e) => {
    e.preventDefault();
    const batchSize = 25;   //this is the limitation of GENO batch write
    if (array && array.length > 0) {
      let data = [];
      for (let row of array) {
        // skip the 1st item
        for (let i = 1; i < row.length; i++) {
          data.push({
            id: row[i],
            phone: row[i],
            stc: stcode,
            status: 0
          });

          // POST to geno in chunks
          if(data.length===batchSize){
            sendChunk(data, i);
            data =[];
           } 
        }
      }

      genoReq("/objs", "post", { objs: data },)
        .then((data) => {
          console.log("Save data:", data);
          setMsg("Data saved to the cloud!");
        }).catch(err => {
          console.error(err);
          setMsg("Error: something went wrong! Please try again later.");
        });
    }else{
      setMsg("Please import the data first.");
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
                setArray([]);
              }}
            >
              Clear
            </Button>
            <Button size="sm" variant="outline-primary"
              onClick={(e) => {
                handleOnSave(e);
              }}
            >
              Save
            </Button>
          </Stack>

        </Form>
      </Stack>
      
      {
        (progress!==undefined) && <ProgressBar max={array.length} now={progress} />
      }

      {
        // render the csv table
        loading ? <div style={styles.middle}><Spinner animation="border" size="lg" /></div> : (
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

      {
        // render the message toast
        msg && <ToastContainer className="p-3" position='middle-center'>
          <Toast delay={1000} autohide show={msg} onClose={() => { setMsg(null) }} bg='warning'>
            <Toast.Body>
              {msg}
            </Toast.Body>
          </Toast></ToastContainer>
      }

    </div>
  );
}
