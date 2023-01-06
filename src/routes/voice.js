import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { buildDialUrl } from '../utils/dial-api';
import { httpReq, buildI4gUrl, buildTwiMlUrl } from "../utils/restUtil";
import Spinner from 'react-bootstrap/Spinner';


export default function VoicePage() {
  const [phone, setPhone] = useState('613-797-7535');
  const [xml, setXml] = useState('https://alancall-react-5626-dev.twil.io/poll1.xml');
  const [text1, setText1] = useState("Please enter a phone number and then click Dial.");
  const [polls, setPolls] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState();

  const fetchPolls = async () => {
    setLoading(true)
    try {
      const data = await httpReq(buildI4gUrl('/poll'))
      setPolls(data)
      setLoading(false)
    } catch (err) {
      console.error("/poll failed:", err);
      setText1("Something went wrong. Please try again later.");
      setLoading(false)
    };
  }

  const callPhoneNumber = (e) => {
    e.preventDefault();

    const pn = phone.trim().replaceAll('-', '');

    if (!pn) {
      setText1("Please enter a phone number!");
      return;
    }

    const twiMLurl = buildTwiMlUrl(selectedPoll);
    const url = buildDialUrl(pn, twiMLurl);
    console.log("API url:", url);

    httpReq(url)
      .then((data) => {
        console.log("Dialed:", phone);
        setText1(`Dialing ${phone} ...`);
      }).catch(err => {
        console.error("Dialing failed:", err);
        setText1("Something went wrong. Please try again later.");
      });
  }

  useEffect(() => {
    fetchPolls();
  }, [])

  const renderLoading = () =>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>;

  return (

    (loading || !polls) ? renderLoading() :

      <Stack gap={2} className="d-inline-block">
        <h5>Dial Phone Number</h5>
        <Stack direction="horizontal" gap={2}>
          <Form.Label>Poll:</Form.Label>
          <Form.Select onChange={e => {
            const pid = Number( e.target.value);
            console.log('selected poll id:', pid);
            const po = polls.find(i => i.id === pid);
            console.log('selected poll:', po);
            setSelectedPoll(po)
          }}>
            <option value={false}>Select the Poll</option>

            {polls.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}

          </Form.Select>


          <Form.Label>Phone Number:</Form.Label>
          <Form.Control
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="123-456-7890"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            style={{ width: '10em' }} />
          {selectedPoll && phone && phone.length > 9 &&
            <Button onClick={callPhoneNumber} size="sm" variant="outline-primary">
              Dial
            </Button>}
        </Stack>

        {selectedPoll &&
          <div className="align-middle">
            {JSON.stringify(selectedPoll, null, 3)}
            <br />
            <br />
            {`TwiML Url: ${buildTwiMlUrl(selectedPoll)}`}
            <br />
          </div>}

        <div style={{ height: "100%" }}>
          <div className="align-middle">
            <br />
            {text1}
          </div>
        </div>
      </Stack>
  );
}

