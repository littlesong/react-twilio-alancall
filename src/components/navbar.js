import React from 'react';
import { Link, } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';

export function Navbar() {
    return (
        <header>
            <nav>
                <Stack className='App-header' direction="horizontal" gap={2}>
                    <Link to="/poll">Polls</Link>
                    <Link to="/data">Data</Link>
                    <Link to="/voice">Call</Link>
                    <Link to="/import">Import</Link>
                    <Link to="/about">About</Link>
                </Stack>
            </nav>
        </header>
    )
}
