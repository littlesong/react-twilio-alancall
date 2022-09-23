import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

export default function VoicePage() {
  return (
      <Stack gap={2}  className="d-inline-block">
        <h5>Dial Phone Number</h5>
        <Stack direction="horizontal" gap={1}>
          <Form.Label>Phone Number:</Form.Label>
          <Form.Control type="tel" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" style={{ width: '10em' }} />
          <Button variant="primary" type="submit">
            Dial
          </Button>
        </Stack>
      </Stack>
  );
}

