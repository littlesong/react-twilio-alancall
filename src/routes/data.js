import { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Link, } from "react-router-dom";

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
    <Stack>
      <Stack direction="horizontal">
        <h5>Phone Numbers</h5>
        <Link to="/import">Import</Link>
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
    </Stack>
  );
}
