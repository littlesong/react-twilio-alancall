/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { buildDialUrl, dialPhoneNumber } from '../utils/dial-api';
import { httpReq, buildI4gUrl, buildTwiMlUrl } from "../utils/restUtil";

const styles = {
  middle: { marginTop: '20%' },
  center: { textAlign: 'center' },
}

const PhoneStatusStyles = {
  invalid: { bgcolor: 'red' },
  hadCalled: { color: 'blue' },
  called: { color: 'green' },
  callFailed: { color: 'red' },
  unknown: { color: 'black' },
}

const PhoneStatus = {
  invalid: 0,       // phone number is invalid
  hadCalled: 1,     // the phone number had been dialed before
  called: 2,        // the phone number was dialed successfully 
  callFailed: 3,    // something wrong when dialing the number
  unknown: 4,
}

export default function ImportCsv() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [header, setHeader] = useState([]);
  const [stcode, setStcode] = useState('KS');
  const [msg, setMsg] = useState('Please import phone numbers.');
  const [progress, setProgress] = useState();
  const [polls, setPolls] = useState();
  const [selectedPoll, setSelectedPoll] = useState();

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
    setArray([]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",").map(i => i?.replace(/^"(.*)"$/, '$1'));
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    const array = csvRows.map(i => i.split(",").map(i => {
      const n = i?.replace(/^"(.*)"$/, '$1');
      const s = (!n || n.length < 10) ? PhoneStatus.invalid : PhoneStatus.unknown;
      return {
        n,
        s,
      }
    }));

    setHeader(csvHeader);
    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      setMsg();
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

  const handleOnSave = (e) => {
    e.preventDefault();

    if (!(array && array.length > 0)) {
      return setMsg('Please import the phone numbers.')
    }
    if (!selectedPoll) {
      return setMsg('Please select the poll.')
    }

    setMsg('Dialing ...')
    for (let row of array) {
      // skip the 1st item
      for (let i = 1; i < row.length; i++) {
        const pn = row[i];
        if (pn && pn.s === PhoneStatus.unknown) {
          dialPhoneNumber(row[i].n, selectedPoll).then((i) => {

          });
        }
      }
    }
  };

  const fetchPolls = async () => {
    setLoading(true)
    try {
      const data = await httpReq(buildI4gUrl('/poll'))
      setPolls(data)
      setLoading(false)
    } catch (err) {
      console.error("/poll failed:", err);
      //setText1("Something went wrong. Please try again later.");
      setLoading(false)
    };
  }

  useEffect(() => {
    fetchPolls();
  }, [])

  return (
    <div>
      <Stack>
        <h5>Import phone numbers from CSV</h5>
        <Form>
          <Stack direction="horizontal" gap={3}>
            <Stack direction="horizontal" gap={2}>
              <input
                type={"file"}
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleOnChange}
              />
              <Button size="sm" variant="outline-primary"
                onClick={(e) => {
                  handleOnSubmit(e);
                }}
              >
                Import
              </Button>
              <Button size="sm" variant="outline-primary"
                onClick={(e) => {
                  setArray([]);
                  setMsg()
                }}
              >
                Clear
              </Button>
            </Stack>

            {polls && polls.length > 0 &&
              <Stack direction="horizontal" gap={2} className="ms-auto">
                <Form.Label>Poll:</Form.Label>
                <Form.Select onChange={e => {
                  const pid = Number(e.target.value);
                  console.log('selected poll id:', pid);
                  const po = polls.find(i => i.id === pid);
                  console.log('selected poll:', po);
                  setSelectedPoll(po)
                }}>
                  <option value={false}>Select the Poll</option>

                  {polls.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}

                </Form.Select>

                <Button size="sm" variant="outline-primary"
                  onClick={(e) => {
                    handleOnSave(e);
                  }}
                >
                  CallAll
                </Button>
              </Stack>}
          </Stack>

        </Form>
      </Stack>

      {
        (progress !== undefined) && <ProgressBar max={array.length} now={progress} />
      }

      {
        // render the csv table
        loading && <div style={styles.middle}><Spinner animation="border" size="lg" /></div>
      }
      {
        (array && array.length > 0) &&
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
                  <td style={PhoneStatusStyles[val.s]} key={val.n}>{val.n}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>

      }

      {
        // render the message toast
        msg && <Stack>{msg}</Stack>
      }

    </div>
  );
}
