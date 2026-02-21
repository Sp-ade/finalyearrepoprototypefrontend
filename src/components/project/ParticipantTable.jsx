import React from 'react';
import { Stack, TextField, Button } from '@mui/material';

const ParticipantTable = ({ rows, onChange, onAdd, onRemove }) => {
    return (
        <>
            {rows.map((r, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <TextField
                        label="Student name"
                        variant="outlined"
                        fullWidth
                        value={r.name}
                        onChange={e => onChange(i, 'name', e.target.value)}
                    />

                    <TextField
                        label="ID"
                        variant="outlined"
                        sx={{ width: 160 }}
                        value={r.id}
                        onChange={e => onChange(i, 'id', e.target.value)}
                    />

                    <Button variant="outlined" onClick={onAdd}>
                        +
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onRemove(i)}
                        disabled={rows.length === 1}
                    >
                        -
                    </Button>
                </Stack>
            ))}
        </>
    );
};

export default ParticipantTable;
