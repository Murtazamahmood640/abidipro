import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, Avatar, Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, styled, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const Clock = () => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInButtonText, setCheckInButtonText] = useState("Check In");
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalMonthlyHours, setTotalMonthlyHours] = useState("0h : 0min : 0sec");

  useEffect(() => {
    const storedCheckInTime = localStorage.getItem('checkInTime');
    const storedIsActive = JSON.parse(localStorage.getItem('isActive'));
    const storedTime = JSON.parse(localStorage.getItem('time'));

    if (storedCheckInTime) {
      setCheckInTime(new Date(storedCheckInTime));
    }
    if (storedIsActive) {
      setIsActive(storedIsActive);
    }
    if (storedTime) {
      setTime(storedTime);
    }

    let interval;
    if (storedIsActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    getEntries();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    localStorage.setItem('isActive', JSON.stringify(isActive));
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('checkInTime', checkInTime ? checkInTime.toISOString() : '');

    return () => clearInterval(interval);
  }, [isActive, time, checkInTime]);

  const handleCheckin = async () => {
    const now = new Date();
    if (!isActive) {
      const todayEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.checkIn).toLocaleDateString();
        return entryDate === now.toLocaleDateString();
      });

      if (todayEntries.length > 0) {
        alert("You cannot clock in more than once per day.");
        return;
      }

      setCheckInTime(now);
      setIsActive(true);
      setCheckInButtonText("Clock Out");
    } else {
      const confirmClockOut = window.confirm("You won't be able to clock in again today. Do you want to proceed?");
      if (!confirmClockOut) return;

      setIsActive(false);
      setCheckInButtonText("Check In");
      const checkOutTime = now;
      const totalTime = (checkOutTime - checkInTime) / 1000; // total time in seconds
      const newEntry = {
        date: checkInTime.toLocaleDateString(),
        day: checkInTime.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: checkInTime.toISOString(),
        checkOut: checkOutTime.toISOString(),
        totalTime: formatTime(totalTime),
        email: localStorage.getItem('email')
      };
      axios.post("https://update-abidibackend.vercel.app/api/timeEntries", newEntry)
        .then((res) => {
          console.log(res);
          getEntries(); // Reload entries without refreshing the page
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.error);
        });
      setTime(0);
      localStorage.removeItem('checkInTime');
      localStorage.removeItem('isActive');
      localStorage.removeItem('time');
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  const getEntries = async () => {
    try {
      const res = await axios.get('https://update-abidibackend.vercel.app/api/timeEntries', {
        params: {
          email: localStorage.getItem('email')
        }
      });
      setTimeEntries(res.data);
      calculateMonthlyHours(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateMonthlyHours = (entries) => {
    const now = new Date();
    const currentMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.checkIn);
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    });
    const totalSeconds = currentMonthEntries.reduce((acc, entry) => {
      const duration = (new Date(entry.checkOut) - new Date(entry.checkIn)) / 1000;
      return acc + duration;
    }, 0);
    setTotalMonthlyHours(formatTime(totalSeconds));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>Clock In and Clock Out</Typography>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 80, height: 80 }}>
                  <AccessTimeIcon fontSize="large" style={{ color: theme.palette.text.primary }} />
                </Avatar>
                <Typography variant="h5" sx={{ mt: 2, color: theme.palette.text.primary }}>Your Time</Typography>
                <Typography variant="h2" sx={{ color: theme.palette.text.primary }}>{formatTime(time)}</Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                  Clocked In: {isActive ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                </Typography>
                <Button
                  variant="contained"
                  color={isActive ? 'secondary' : 'primary'}
                  onClick={handleCheckin}
                  startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
                  sx={{ mt: 2 }}
                >
                  {checkInButtonText}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, maxHeight: '75vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Day</StyledTableCell>
                  <StyledTableCell>Check In</StyledTableCell>
                  <StyledTableCell>Check Out</StyledTableCell>
                  <StyledTableCell>Total Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.day}</TableCell>
                    <TableCell>{new Date(entry.checkIn).toLocaleTimeString()}</TableCell>
                    <TableCell>{new Date(entry.checkOut).toLocaleTimeString()}</TableCell>
                    <TableCell>{entry.totalTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Typography variant="h5" sx={{ mt: 2, color: theme.palette.text.primary }}>Total Monthly Hours: {totalMonthlyHours}</Typography>
    </Box>
  );
};

export default Clock;
