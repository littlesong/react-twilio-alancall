import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { httpReq } from "../utils/restUtil";

//const i4gBaseUrl = 'https://gl0.mygreenaward.com/pub/ac';
const i4gBaseUrl = 'https://gl0.mygreenaward.com/pub/ac';
function buildUrl(path){
    return `${i4gBaseUrl}${path}`
}

export default function PollPage() {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [text1, setText1] = useState("");
    const [polls, setPolls] = useState([]);

    const fetchPolls = async () => {
        httpReq(``)
        .then((data) => {
          console.log("Dialed:", phone);
          setText1(`Dialing ${phone} ...`);
        }).catch(err => {
          console.error("Dialing failed:", err);
          setText1("Something went wrong. Please try again later.");
        });

        const p = await DataStore.query(Poll);
        console.log('polls: ', p);
        setPolls(p);
    }

    useEffect(() => {
        const sub = DataStore.observeQuery(Poll).subscribe(({ items }) => {
            setPolls(items);
        });

        return () => {
            sub.unsubscribe();
        };
    }, [])

    const onCreatePoll = () => {
        DataStore.save(
            new Poll({
                title: name,
                description: content,
            })
        ).then(data => {
            /*      fetchPolls().catch(err => {
                   console.error(err);
                 }) */
            console.log('Poll saved: ', data)
        }).catch((err) => {
            console.log("Error saving post", err);
        });
    }


    const renderLoading = () =>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;



    const renderPolls = () => {

        return (
            <Stack gap={2} className="d-inline-block" style={{ margin: '10px' }}>
                <AlancallNavbar />
                <h3>Polls</h3>

                <Stack>
                    {
                        <Table striped bordered hover responsive size="sm" style={{ marginTop: '10px' }}>
                            <thead>
                                <tr key={"header"}>
                                    {['Name', 'Description'].map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {polls.map((item) => (
                                    <tr key={item.id}>
                                        <td> {item.title} </td>
                                        <td>{item.description}</td>
                                        <td> <Link href={`/alancall/polls/${item.id}`} >Edit</Link> </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                </Stack>

                <Stack style={{ marginTop: '10px' }}>
                    <h6>Create New Poll</h6>
                    <Form onSubmit={onCreatePoll}>
                        <Stack direction="horizontal" gap={2} >

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label column='sm'>Poll Name: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent">
                                <Form.Label column='sm'>Description: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                />
                            </Form.Group>

                            <Button type="submit" size="sm" variant="outline-primary">
                                Create
                            </Button>

                        </Stack>
                    </Form>

                    {
                        text1 && <div style={{ height: "100%" }}>
                            <div className="align-middle">
                                <br />
                                {text1}
                            </div>
                        </div>
                    }
                </Stack>
            </Stack>

        );
    }

    return (
        polls?renderPolls():renderLoading()
    );
}

