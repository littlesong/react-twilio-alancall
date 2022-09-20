import { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

export default function DataPage() {

  const [phoneData, setPhoneData] = useState([
    '16137977535', '12345678900'
  ]);
  const [selected, setSlected] = useState('');

  const onChange = selectedValues => {
    // handle selected values here
  };

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Data Page</h2>
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
