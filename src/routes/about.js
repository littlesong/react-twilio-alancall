/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';
import { VERSION } from '../constants'

const PhoneStatusColorCode = {
    invalid: { color: 'brown' },
   // hadCalled: { color: 'blue' },
    called: { color: 'green' },
    callFailed: { color: 'red' },
    uncalled: { color: 'black' },
    duplicate: { color: 'grey' }
}

export default function AboutPage() {
    const settings = {
        rate: 'slow'
    }

    const renderColorCodes = () => {
       return Object.entries(PhoneStatusColorCode).map(([k, v]) => {
            console.log(k, v);
            return (<div style={v}> {`${k} : ${v.color}`} </div>)
        })
    }

    return (
        <div>
            <Stack>
                <h4>Alancall</h4>
                Version: {VERSION}
                <p />
            </Stack>
            <Stack>
                <h5>Settings</h5>
                <p>
                    Settings is stored in a special 'Poll' called '&lt;settings&gt;'. It is the description value of that poll. The settings data is
                    a JSON object. Ie.
                    <h6>{JSON.stringify(settings)}</h6>
                </p>
            </Stack>
            <Stack>
                <h5>Speaking Rate</h5>
                <p>
                    Speaking rate is configured by settings. The supported values are:
                    <h6>x-slow, slow, medium, fast, x-fast, n% (n from 20 to 200)</h6>
                </p>
            </Stack>

            <Stack>
                <h5>Phone# Color Code</h5>
                <div>
                    {renderColorCodes()}
                </div>
            </Stack>

        </div>
    );
}
