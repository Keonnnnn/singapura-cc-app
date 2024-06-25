import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

function Notes() {
    const [notesList, setNotesList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getNotes = () => {
        http.get('/notes').then((res) => {
            setNotesList(res.data);
        });
    };

    const searchNotes = () => {
        http.get(`/notes?search=${search}`).then((res) => {
            setNotesList(res.data);
        });
    };

    useEffect(() => {
        getNotes();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchNotes();
        }
    };

    const onClickSearch = () => {
        searchNotes();
    };

    const onClickClear = () => {
        setSearch('');
        getNotes();
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ my: 2 }}>Notes</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder='Search...' onChange={onSearchChange} onKeyDown={onSearchKeyDown} sx={{ mr: 1 }} />
                <IconButton color="secondary" onClick={onClickSearch}>
                    <Search />
                </IconButton>

                <IconButton color="secondary" onClick={onClickClear}>
                    <Clear />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addnote" style={{ textDecoration: 'none' }}>
                    <IconButton sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'white', borderRadius: '50%' }}>
                        <Add />
                    </IconButton>
                </Link>
            </Box>

            <Grid container spacing={2}>
                {
                    notesList.map((note, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={note.id}>
                                <Card sx={{ borderRadius: 2 }}>  {/* Adjust borderRadius as needed */}
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, fontSize: '1.25rem', flexGrow: 1 }}>{note.title}</Typography>

                                            <Link to={`/editnote/${note.id}`}>
                                                <IconButton color="secondary" sx={{ padding: '4px' }}>
                                                    <Edit sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>
                                            </Link>
                                        </Box>

                                        <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2, fontSize: '1rem' }}>{note.description}</Typography>

                                        {
                                            note.imageFile && (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                                    <img src={`${import.meta.env.VITE_FILE_BASE_URL}${note.imageFile}`} alt="note" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                                                </Box>
                                            )
                                        }

                                        <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                            <AccessTime sx={{ mr: 0.5, fontSize: '1rem' }} />
                                            <Typography sx={{ fontSize: '0.865rem' }}>{dayjs(note.createdAt).format(global.datetimeFormat)}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Notes;
