import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import { httpReq, buildI4gUrl } from "../utils/restUtil";
import { OP_REMOVE_ALL } from '../constants'

export default function PollPage() {
    const [content, setContent] = useState('');
    const [ans, setAns] = useState(1);    // number of answers
    const [order, setOrder] = useState(100);    // orderid

    const [questions, setQuestions] = useState([]);

    const [poll, setPoll] = useState();
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const [loading, setLoading] = useState(true);

    const [msg, setMsg] = useState();

    const params = useParams();
    const pollId = params.id;

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
        const fetchPoll = async (pollId) => {
            setLoading(true)
            try {
                const data = await httpReq(buildI4gUrl(`/poll/${pollId}`))
                console.log("Poll:", data);
                setPoll(data)
                setNewTitle(data.name)
                setNewDesc(data.descrp)
                setLoading(false)
            } catch (err) {
                console.error("/poll/:id failed:", err);
                //setText1("Something went wrong. Please try again later.");
                setLoading(false)
            }
        }
    
        fetchPoll(pollId).then(
            (p) => {
                queryQuestions();
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pollId])

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

    const updatePoll = () => {
        setLoading(true)
        httpReq(buildI4gUrl(`/poll/${pollId}`), 'patch',
            {
                name: newTitle, 
                descrp: newDesc
            }).then(data => {
                console.log("updatePoll:", data);
                setLoading(false)
            }).catch(err => {
                console.error("updatePoll failed:", err);
                setLoading(false)
            })
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

    const resetPoll = () => {
        setLoading(true)
        httpReq(buildI4gUrl(`/poll/${pollId}`), 'post', { answer: OP_REMOVE_ALL }).then(data => {
            console.log("ResetPoll:", data);
            setLoading(false)
        }).catch(err => {
            console.error("ResetPoll failed:", err);
            setLoading(false)
        })
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
                    <Form id="form1" onSubmit={updatePoll}>
                        <Stack direction="horizontal" gap={2} >
                            <Form.Group className="mb-3" controlId="formBasicName1">
                                <Form.Label column='sm'>Poll Name: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTitle}
                                    onChange={(e)=>setNewTitle(e.target.value)}
                                    />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent1">
                                <Form.Label column='sm'>Description: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newDesc}
                                    onChange={(e)=>setNewDesc(e.target.value)}
                                />
                            </Form.Group>

                            <Button type="submit" size="sm" variant="outline-primary">
                                Update Poll
                            </Button>
                            <Button size="sm" variant="outline-primary" onClick={resetPoll}>
                                Reset Answers
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
                    <Form id="form2" onSubmit={onCreateQuestion}>
                        <Stack direction="horizontal" gap={2} >

                            <Form.Group className="mb-3" controlId="formBasicName2">
                                <Form.Label column='sm'>Question: </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={content}
                                    onChange={e => setContent(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent2">
                                <Form.Label column='sm'>Num Answers: </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ans}
                                    onChange={e => setAns(Number(e.target.value))}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicContent3">
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

