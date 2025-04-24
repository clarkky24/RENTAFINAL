import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment'; // Ensure you have this imported
import axios from 'axios';
import RoomCard from '../DashboardPages/roomcard';
import { Link } from 'react-router-dom'; // Added for navigation

const AvailRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await axios.get('/api/tenants');
        const tenants = response.data;

    
        const allRooms = [
          { property: 'Lalaine', totalRooms: 28 },
          { property: 'Jade', totalRooms: 30 },
        ];
    
        const roomsData = allRooms.flatMap((building) =>
          Array.from({ length: building.totalRooms }, (_, i) => {
            const floorNumber = Math.floor(i / 10) + 1; // Floors start from 1
            const roomPosition = (i % 10) + 1;          // Room positions start from 1
            const roomNumber = `${floorNumber}${String(roomPosition).padStart(2, '0')}`; // Format as 101, 201, etc.
            // Match tenant data to room
            const tenant = tenants.find(
              (tenant) =>
                tenant.roomNumber === roomNumber &&
                tenant.property.toLowerCase() === building.property.toLowerCase()
            );
    
            // Debug log to verify room assignments
            console.log(`Building: ${building.property}, Room: ${roomNumber}, Is Rented: ${!!tenant}`);
    
            return {
              roomNumber,
              isRented: !!tenant,
              property: building.property,
              tenant: tenant || null,
            };
          })
        );
    
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      }
    };
    

    fetchTenantData();
  }, []);

  const filteredRooms = rooms.filter(room => room.property === selectedBuilding);
  const handleBuildingClick = (building) => {
    setSelectedBuilding(selectedBuilding === building ? null : building);
  };

  return (
<Box className="px-16 py-8 bg-blue-50 min-h-screen w-full">
          {/* Back to Homepage Button */}
          {/* <Box sx={{ mt: 6, mr:10, textAlign: 'end' }}>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/"
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            px: 4,
            borderColor: '#3b82f6',
            color: '#0A4580',
            '&:hover': {
              borderColor: '#2563eb',
              color: '#2563eb',
            }
          }}
        >
          Back to Homepage
        </Button>
      </Box> */}


      <div className="text-center mb-10 mt-16">
        <h2 className="text-5xl font-bold font-playfair text-blue-800 tracking-widest">
          <span className="text-8xl block">Available</span> Units
        </h2>
      </div>

      <Grid container spacing={4} justifyContent="center">
        {['Lalaine', 'Jade'].map((building) => (
          <Grid item xs={12} sm={6} md={4} key={building}>
            <Card 
              variant="outlined" 
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedBuilding === building ? '#D8EEF8' : '#D8EEF8',
                borderRadius: 5, 
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                transition: 'transform 0.4s, box-shadow 0.4s',
                '&:hover': { 
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)' 
                },
              }}
              onClick={() => handleBuildingClick(building)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <IconButton sx={{ fontSize: '3rem', color: '#3b82f6', mb: 2 }}>
                  <ApartmentIcon fontSize="inherit" />
                </IconButton>
                <Typography variant="h4" sx={{
                  fontWeight: '700',
                  fontFamily: 'quickplay',
                  letterSpacing: '2px',
                  color: '#1e3a8a',
                }}>
                  {building} Building
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280', mt: 1 }}>
                  Total Rooms: {rooms.filter(room => room.property === building).length}
                </Typography>
                <Button 
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    backgroundColor: '#3b82f6', 
                    color: '#fff', 
                    fontWeight: 600, 
                    textTransform: 'capitalize',
                    borderRadius: 2,
                    px: 4,
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    }
                  }}
                > 
                  {selectedBuilding === building ? 'Hide Rooms' : 'View Rooms'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedBuilding && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{
            color: '#1e3a8a',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            letterSpacing: '1.5px'
          }}>
            {selectedBuilding} Building - Room Details
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {filteredRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={`${room.property}-${room.roomNumber}`}>
                <RoomCard 
                  roomNumber={room.roomNumber} 
                  isRented={room.isRented} 
                  property={room.property} 
                  // tenant={room.tenant} 
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );





}

export default AvailRoom;


