/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import Stack from 'react-bootstrap/Stack';
import { genoReq } from "../utils/restUtil";

export default function AboutPage() {
    const [genoMeta, setGenoMeta] = useState();

    useEffect(() => {
        genoReq("/meta")
            .then((data) => {
                setGenoMeta(data);
            }).catch(err => {
                console.error("geno failed:", err);
            });
    }, [])

    return (
        <div>
            <Stack>
                <h5>Geno</h5>
                {JSON.stringify(genoMeta)}
            </Stack>
        </div>
    );
}
