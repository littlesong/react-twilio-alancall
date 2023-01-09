/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';

export default function AboutPage() {
    const [genoMeta, setGenoMeta] = useState('1.1');

    return (
        <div>
            <Stack>
                <h5>Alancall</h5>
                { genoMeta }
            </Stack>
        </div>
    );
}
