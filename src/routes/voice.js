import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { httpReq } from "../utils/restUtil";

const baseUrl = "https://test-service1-3651.twil.io/fun1";


export default function VoicePage() {
  const [phone, setPhone] = useState('613-797-7535');
  const [text1, setText1] = useState("Please enter a phone number and then click Dial.");

  const callPhoneNumber = (e) => {
    e.preventDefault();

    const pn = phone.trim().replaceAll('-','');

    if (!pn) {
      setText1("Please enter a phone number!");
      return;
    }

    const url = `${baseUrl}?phone=1${pn}`;

    httpReq(url)
      .then((data) => {
        console.log("Dialed:", phone);
        setText1(`Dialing ${phone} ...`);
      }).catch(err => {
        console.error("Dialing failed:", err);
        setText1("Something went wrong. Please try again later.");
      });
  }

  return (
    <Stack gap={2} className="d-inline-block">
      <h5>Dial Phone Number</h5>
      <Stack direction="horizontal" gap={2}>
        <Form.Label>Phone Number:</Form.Label>
        <Form.Control
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="123-456-7890"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          style={{ width: '10em' }} />
        <Button onClick={callPhoneNumber} size="sm" variant="outline-primary">
          Dial
        </Button>
      </Stack>
      <div style={{ height: "100%" }}>
        <div className="align-middle">
          <br />
          {text1}
        </div>
      </div>
    </Stack>
  );
}

