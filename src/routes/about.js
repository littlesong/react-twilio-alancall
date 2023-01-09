/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';
import { VERSION } from '../constants'

export default function AboutPage() {

    return (
        <div>
            <Stack>
                <h5>Alancall</h5>
                { VERSION }
            </Stack>
        </div>
    );
}
