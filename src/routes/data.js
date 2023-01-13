import { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link, } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import { PollSelector } from "../components/poll-selector"
import { httpReq, buildI4gUrl } from "../utils/restUtil";

export default function DataPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState();
  const [results, setResults] = useState();
  const [msg, setMsg] = useState();

  const onPollChanged = (poll) => {
    console.log('poll selected', poll)
    if (poll) {
      setSelectedPoll(poll)
      fetchResults(poll)
    } else {
      setSelectedPoll()
      setResults()
    }
  }

  const fetchResults = (poll) => {
    setResults([])
    setMsg()
    setLoading(true);
    httpReq(buildI4gUrl(`/poll/${poll.id}/answer`))
      .then(data => {
        console.log('Poll results:', data)
        setResults(data.data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        setMsg(err)
      })
  }

  return (
    <Stack>
      <h5>Results</h5>
      <Stack direction="horizontal" gap={3}>
        <PollSelector title='Poll: '
          onLoaded={(err, data) => {
            setLoading(false);
          }}
          onSelectionChanged={onPollChanged}
        />
      </Stack>

      {!loading && <Stack>
        <br/>
          { (results && results.length >0)?`${results.length} answers`:(results?'no answer':'Please select poll') }
      </Stack>}

      {!loading && selectedPoll && results && results.length >0 && <Stack>
        <CSVLink
          data={results}
          filename={`Poll${selectedPoll.id}-results.csv`}>Download Poll Results as CSV</CSVLink>
      </Stack>}

      {loading && <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      }
      {msg && <Stack>
        <Alert key={'danger'} variant={'danger'}>
          {msg}
        </Alert>
      </Stack>
      }

    </Stack>
  );
}
