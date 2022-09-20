import { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function DataPage() {

  const [phoneData, setPhoneData] = useState([
    '16137977535', '12345678900'
  ]);
  const [selected, setSlected] = useState('');

  const onChange = selectedValues => {
    // handle selected values here
  };

  const onImport = () => {
    // handle importing csv
  };

  return (
    <main style={{ padding: "1rem 0" }}>
      <Stack direction="horizontal">
      <h5>Phone Numbers</h5>
      <Button variant="link" onClick={ onImport }>Import</Button>
      </Stack>
      <CardGroup>
      <Card>
        <Card.Body>
          <ListGroup>
            {
              phoneData.map((i) => {
                return <ListGroup.Item> {i} </ListGroup.Item>
              })
            }
          </ListGroup>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Info</Card.Title>

        </Card.Body>
      </Card>
      </CardGroup>
    </main>
  );
}
