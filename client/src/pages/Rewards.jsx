import React, { useEffect, useState } from 'react'
import { Box, Typography} from '@mui/material';
import http from '../http';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchBar from '@mkyy/mui-search-bar';

function Rewards() {
    const [rewardList, setRewardList] = useState([]);

    const [search, setSearch] = useState('');   
    const onSearchChange = (e) => {
        setSearch(e);
    };

    const getRewards = () => {
        http.get('/reward').then((res) => {
            setRewardList(res.data);
        });
    };
    const searchRewards = () => {
        http.get(`/reward?search=${search}`).then((res) => {
            setRewardList(res.data);
        });
    };
    useEffect(() => {
        const getInitialRewards = async () => {
            const response = await http.get('/reward');
            setRewardList(response.data);
        };

        getInitialRewards();
    }, []); // Empty dependency array fetches on mount
    const onClickSearch = () => {
        searchRewards();
    }
    const onClickClear = () => {
        setSearch('');
        getRewards();
    };
    return (
        <Box sx={{borderColor:'black'}}>
            <Typography variant='h5' sx={{ margin: '-100px 0px 0px 100px'}}>Rewards</Typography>
            <Box sx={{ width: '100%', margin: '50px 0px 0px 100px'}}>
            <SearchBar
                value={search} // Bind search state to SearchBar value
                onChange={onSearchChange} // Update search state on input change
                onSearch={onClickSearch}
                onCancel={onClickClear} // Handle clear button click (optional)
            />
            </Box>
            <TableContainer component={Paper} sx={{ width: '100%', margin: '30px 0px 0px 100px'}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Reward Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Tier</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rewardList.map((reward) => (
                            <TableRow
                                key={reward.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{reward.id}</TableCell>
                                <TableCell component="th" scope="row">
                                    {reward.rewardName}
                                </TableCell>
                                <TableCell>{reward.description}</TableCell>
                                <TableCell>{reward.Points}</TableCell>
                                <TableCell>{reward.Tier}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Rewards