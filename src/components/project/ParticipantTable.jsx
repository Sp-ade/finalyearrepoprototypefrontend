import React from 'react';
import { Stack, TextField, Button, Box } from '@mui/material';

//student input part from all project creations
const ParticipantTable = ({ students, onChange, onAdd, onRemove }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {students.map((r, i) => (
                <Stack key={i} direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexGrow: 1 }}>
                        <TextField
                            label="ID"
                            variant="outlined"
                            sx={{ width: { xs: '100%', sm: 160 } }}
                            value={r.id}
                            onChange={e => onChange(i, 'id', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Student name"
                            variant="outlined"
                            fullWidth
                            value={r.name}
                            onChange={e => onChange(i, 'name', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={onAdd} sx={{ flexGrow: { xs: 1, sm: 0 }, minHeight: 56 }}>
                            +
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onRemove(i)}
                            disabled={students.length === 1}
                            sx={{ flexGrow: { xs: 1, sm: 0 }, minHeight: 56 }}
                        >
                            -
                        </Button>
                    </Stack>
                </Stack>
            ))}
        </Box>
    );
};

export default ParticipantTable;
