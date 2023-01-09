import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import { httpReq, buildI4gUrl } from "../utils/restUtil";

export default function PollPage() {
    const [content, setContent] = useState('');
    const [ans, setAns] = useState(1);    // number of answers
    const [order, setOrder] = useState(100);    // orderid

    const [questions, setQuestions] = useState([]);

    const [poll, setPoll] = useState();
    const [newTitle, setNewTitle] = useState();
    const [newDesc, setNewDesc] = useState();

    const [loading, setLoading] = useState(true);

    const [msg, setMsg] = useState();

    const params = useParams();
    const pollId = params.id;

    const fetchPoll = async (pollId) => {
        setLoading(true)
        try {
            const data = await httpReq(buildI4gUrl(`/poll/${pollId}`))
            console.log("Poll:", data);
            setPoll(data)
            setLoading(false)
        } catch (err) {
            console.error("/poll/:id failed:", err);
            //setText1("Something went wrong. Please try again later.");
            setLoading(false)
        }
    }

    const queryQuestions = async () => {
        console.log("query questions ...")
        setLoading(true)
        try {
            const data = await httpReq(buildI4gUrl(`/poll/${pollId}/quest`))
            console.log("Poll questions:", data);
            setQuestions(data)
            setLoading(false)
        } catch (err) {
            console.error("/poll/:id/quest failed:", err);
            //setText1("Something went wrong. Please try again later.");
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('loading 1 ...')
        fetchPoll(pollId).then(
            (p) => {
                queryQuestions();
            }
        )
    }, [])

    const onCreateQuestion = () => {
        setLoading(true);
        setMsg()
        console.log('Saving question in: ', poll)

        httpReq(buildI4gUrl(`/poll/${poll.id}/quest`), 'post',
            {
                content,
                maxans: ans,
                orderid: order,
            })
            .then((data) => {
                console.log('question saved: ', data);
                queryQuestions();
            }).catch(err => {
                console.error("/poll/:id/quest POST failed:", err);
                //setText1("Something went wrong. Please try again later.");
                setLoading(false)
            });
    }

    const updatePoll = async () => {
    }


    const onUpdatePoll = () => {
        updatePoll().catch((err) => {
            console.log("Error onUpdatePoll", err);
        });
    }

    const deleteQuestion = (item) => {
        console.log('deleting quest: ', item);
        setMsg()
        httpReq(buildI4gUrl(`/poll/${pollId}/quest/${item.id}`), 'delete',)
            .then((data) => {
                console.log('question delete: ', data);
                queryQuestions();
            }).catch(err => {
                console.error("/poll/:id/quest/:id DELETE failed:", err);
                //setText1("Something went wrong. Please try again later.");
                setLoading(false)
                setMsg('Cannot delete the question because it is already been answered')
            });
    }

    const renderLoading =
        loading && <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;

    const renderPoll = () => {
        return (
            <Stack gap={2} className="d-inline-block" style={{ margin: '10px' }}>
                <h4>Poll</h4>
                {poll.id}
                <Stack style={{ marginTop: '10px' }}>
                    <Form onSubmit={onUpdatePoll}>
                        <Stack direction="horizontal" gap={2} >
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label column='sm'>Poll Name: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={poll?.title}
                                    onChange={e => setNewTitle(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent">
                                <Form.Label column='sm'>Description: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={poll?.description}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </Form.Group>

                            <Button type="submit" size="sm" variant="outline-primary">
                                Update Poll
                            </Button>

                        </Stack>
                    </Form>
                </Stack>

                <Stack>
                    <h5>Questions: </h5>
                    {
                        questions && <Table striped bordered hover responsive size="sm" style={{ marginTop: '10px' }}>
                            <thead>
                                <tr key={"header"}>
                                    {['id', 'Question', 'Answers', 'Order'].map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {questions.map((item) => (
                                    <tr key={item.id}>
                                        <td > {item.id}</td>
                                        <td > {item.content}</td>
                                        <td > {item.maxans}</td>
                                        <td > {item.orderid}</td>
                                        <td> <Button onClick={() => { deleteQuestion(item) }}>Delete</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                </Stack>

                <Stack style={{ marginTop: '10px' }}>
                    <h6>Add New Question:</h6>
                    <Form onSubmit={onCreateQuestion}>
                        <Stack direction="horizontal" gap={2} >

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label column='sm'>Question: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={content}
                                    onChange={e => setContent(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent">
                                <Form.Label column='sm'>Num Answers: </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ans}
                                    onChange={e => setAns(Number(e.target.value))}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent">
                                <Form.Label column='sm'>Order: </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={order}
                                    onChange={e => setOrder(Number(e.target.value))}
                                />
                            </Form.Group>

                            <Button type="submit" size="sm" variant="outline-primary">
                                Add
                            </Button>

                        </Stack>
                    </Form>
                </Stack>
                {renderLoading}
                {msg && <Alert key={'danger'} variant={'danger'}>
                    {msg}
                </Alert>}
            </Stack>);
    }

    return (
        poll && renderPoll()
    );
}

