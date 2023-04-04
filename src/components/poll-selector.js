import React, { useState, useEffect } from "react";
import { httpReq, buildI4gUrl } from "../utils/restUtil";
import Form from 'react-bootstrap/Form';

/**
 * onLoaded(err, data): 
 *  err: err message if failed
 *  data: list of polls if succeeded
 *  
 * onSelectionChanged(selectedPollId):
 *  selectedPollId: the selected poll id
 * 
 * @param {*} param0 
 * @returns 
 */
export function PollSelector({ title, onLoaded, onSelectionChanged }) {
    const [polls, setPolls] = useState();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const data = await httpReq(buildI4gUrl('/poll'))
                setPolls(data)
                if (onLoaded) onLoaded(undefined, data)
            } catch (err) {
                console.error("/poll failed:", err);
                if (onLoaded) onLoaded(err)
            };
        }

        fetchPolls();
    })

    return (
        <>
            {title && <Form.Label> {title} </Form.Label>}
            <Form.Select onChange={e => {
                const pid = Number(e.target.value);
                const po = polls.find(i => i.id === pid);
                if (onSelectionChanged) onSelectionChanged(po)
            }}>
                <option value={false}>Select Poll</option>

                {polls && polls.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}

            </Form.Select>
        </>
    )
}
