import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Tooltip, InputAdornment, Dialog, DialogContent } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Add, Close } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

function Notes() {
    const [notesList, setNotesList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [openModal, setOpenModal] = useState(false);
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

    useEffect(() => {
        if (search.trim() !== '') {
            searchNotes();
        } else {
            getNotes(); // Fetch all notes if the search query is empty
        }
    }, [search]);

    const onClickClear = () => {
        setSearch('');
    };

    const handleCardClick = (note) => {
        setSelectedNote(note);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedNote(null);
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
                variant="h4"
                sx={{ my: 2, textAlign: "center", color: "#e2160f", fontWeight: "bold" }}
            >
                My Notes
            </Typography>
                <Link to="/addnote" style={{ textDecoration: 'none' }}>
                    <Tooltip title="Add Note">
                        <IconButton sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'white', borderRadius: '50%' }}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder='Search...'
                    onChange={onSearchChange}
                    sx={{ mr: 1, flexGrow: 1, borderBottom: '1px solid gray' }}
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                />
                <Tooltip title="Clear">
                    <IconButton color="primary" onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={2}>
                {notesList.map((note) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                        <Card
                            sx={{ borderRadius: 2, boxShadow: 3, maxWidth: '100%', cursor: 'pointer' }}
                            onClick={() => handleCardClick(note)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {note.title}
                                    </Typography>
                                    <Link to={`/editnote/${note.id}`} style={{ textDecoration: 'none' }}>
                                        <Tooltip title="Edit Note">
                                            <IconButton color="primary">
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                                    {note.description}
                                </Typography>
                                {note.imageFile && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <img
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${note.imageFile}`}
                                            alt="note"
                                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                                        />
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                    <AccessTime sx={{ mr: 0.5, fontSize: '1rem' }} />
                                    <Typography sx={{ fontSize: '0.875rem' }}>
                                        {dayjs(note.createdAt).format(global.datetimeFormat)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                sx={{ '.MuiPaper-root': { borderRadius: 2 } }}
            >
                <Box sx={{ position: 'relative' }}>
                    <Tooltip title="Close">
                        <IconButton
                            color="secondary"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255,255,255,0.8)',
                                borderRadius: '50%',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,1)',
                                },
                            }}
                            onClick={handleCloseModal}
                        >
                            <Close />
                        </IconButton>
                    </Tooltip>
                    {selectedNote && (
                        <DialogContent>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {selectedNote.title}
                            </Typography>
                            <Typography sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                                {selectedNote.description}
                            </Typography>
                            {selectedNote.imageFile && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${selectedNote.imageFile}`}
                                        alt="note"
                                        style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px' }}
                                    />
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }} color="text.secondary">
                                <AccessTime sx={{ mr: 0.5, fontSize: '1rem' }} />
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    {dayjs(selectedNote.createdAt).format(global.datetimeFormat)}
                                </Typography>
                            </Box>
                        </DialogContent>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
}

export default Notes;
