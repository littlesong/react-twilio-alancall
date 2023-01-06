import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { httpReq, buildI4gUrl } from "../utils/restUtil";
import { Link, } from "react-router-dom";

export default function PollListPage() {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [text1, setText1] = useState("");
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPolls = async () => {
        setLoading(true)
        try {
            const data = await httpReq(buildI4gUrl('/poll'))
            console.log("Polls:", data);
            setPolls(data)
            setLoading(false)
        } catch (err) {
            console.error("/poll failed:", err);
            setText1("Something went wrong. Please try again later.");
            setLoading(false)
        };
    }

    useEffect(() => {
        fetchPolls();
    }, [])

    const onCreatePoll = () => {
        setLoading(true)
        const body = { name, descrp: content }
        console.log('posting: ', body)
        httpReq(buildI4gUrl('/poll'), 'post', body)
            .then((data) => {
                console.log("create poll result:", data);
                fetchPolls()
            }).catch(err => {
                console.error("/poll failed:", err);
                setText1("Something went wrong. Please try again later.");
                setLoading(false)
            });
    }

    const renderLoading = () =>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;

    const renderPolls = () => {

        return (
            <Stack gap={2} className="d-inline-block" style={{ margin: '10px' }}>
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
                                        <td> {item.name} </td>
                                        <td>{item.descrp}</td>
                                        <td> <Link to={`/poll/${item.id}`} >Edit</Link> </td>
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

                loading&& renderLoading()

            </Stack>

        );
    }

    return (
        polls ? renderPolls() : renderLoading()
    );
}

