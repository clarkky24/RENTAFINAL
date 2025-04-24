import React, { useState } from 'react';
import { 
  Card, Box, CardContent, Typography, IconButton, Button, Dialog, 
  DialogTitle, DialogContent, DialogContentText, DialogActions, TextField 
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { format } from 'date-fns'; 
import axios from 'axios';
import { useAuthContext } from '../Hook/useAuthHook';

const RoomCard = ({ roomNumber, isRented, property, tenant }) => {
  const [openTenantDialog, setOpenTenantDialog] = useState(false); // Tenant Info dialog
  const [openRoomDialog, setOpenRoomDialog] = useState(false); // Room Info dialog
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false); // Application dialog
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // Success dialog

  // Application data state
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
  });

  const { user } = useAuthContext();

  // Helper functions to anonymize data
  const anonymizeName = (name) => {
    if (!name) return '';
    return name.split(' ').map(word => {
      if (word.length <= 2) return word;
      const first = word[0];
      const last = word[word.length - 1];
      return first + '*'.repeat(word.length - 2) + last;
    }).join(' ');
  };

  const anonymizeEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    const visibleChars = 2;
    return local.slice(0, visibleChars) + '*'.repeat(local.length - visibleChars) + '@' + domain;
  };

  const anonymizePhone = (phone) => {
    if (!phone) return '';
    if (phone.length <= 4) return phone;
    return phone.slice(0, 3) + '*'.repeat(phone.length - 4) + phone.slice(-1);
  };

  const handleOpenTenantDialog = () => {
    setOpenTenantDialog(true);
  };

  const handleCloseTenantDialog = () => {
    setOpenTenantDialog(false);
  };

  const handleOpenRoomDialog = () => {
    setOpenRoomDialog(true);
  };

  const handleCloseRoomDialog = () => {
    setOpenRoomDialog(false);
  };

  const handleOpenApplicationDialog = () => {
    setOpenApplicationDialog(true);
  };

  const handleCloseApplicationDialog = () => {
    setOpenApplicationDialog(false);
  };

  const handleSubmitApplication = async () => {
    try {
      // Send a POST request to your backend with the application data
      await axios.post('/api/apply', {
        building: property,
        roomNumber,
        fullName: applicationData.fullName,
        email: applicationData.email,
        contactNumber: applicationData.contactNumber,
      });
      // Clear the application data and close the dialog
      setApplicationData({ fullName: '', email: '', contactNumber: '' });
      handleCloseApplicationDialog();
      // Open success dialog
      setOpenSuccessDialog(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again later.");
    }
  };

  const formattedLeaseStart = tenant?.leaseStartDate 
    ? format(new Date(tenant.leaseStartDate), 'yyyy-MM-dd') 
    : 'N/A';
  const formattedLeaseEnd = tenant?.leaseEndDate 
    ? format(new Date(tenant.leaseEndDate), 'yyyy-MM-dd') 
    : 'N/A';

  console.log(`Room ${roomNumber} in ${property} is rented: ${isRented}`);

  return (
    <>
      <Card 
        variant="outlined" 
        sx={{ 
          maxWidth: 350, 
          backgroundColor: "FFF1DB",
          borderRadius: 3, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          transition: 'transform 0.3s', 
          '&:hover': { transform: 'scale(1.02)' },
          marginBottom: 2
        }}
        className="mb:max-w-full tb:max-w-[90%]"
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',       
              color: property === 'Lalaine' ? '#4C4B16' : property === 'Jade' ? '#091057' : 'default', 
              textAlign: 'center', 
              marginBottom: 1, 
              fontFamily: "quickplay", 
              letterSpacing: '2px'
            }}
            className="mb:text-lg tb:text-xl"
          >
            {property} Building
          </Typography>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 500,       
              color: property === 'Lalaine' ? '#4C4B16' : property === 'Jade' ? '#091057' : 'default', 
              textAlign: 'center', 
              marginBottom: 1, 
              fontFamily: "quickplay", 
              letterSpacing: '2px', 
              fontSize: '1.2rem'
            }}
            className="mb:text-base tb:text-lg"
          >
            Room {roomNumber} 
          </Typography>

          <IconButton 
            sx={{ 
              backgroundColor: isRented ? 'error.light' : 'success.light', 
              color: '#fff', 
              width: '60px', 
              height: '60px',
              '&:hover': { backgroundColor: isRented ? 'error.main' : 'success.main' }
            }}
          >
            {isRented ? <Lock sx={{ fontSize: 40 }}/> : <LockOpen sx={{ fontSize: 40 }}/>}
          </IconButton>
          <Typography 
            sx={{ 
              mt: 1,
              mb: 2, 
              color: isRented ? '#C62E2E' : '#337357', 
              textTransform: 'uppercase', 
              fontSize: '1rem', 
              letterSpacing: "2px", 
              fontWeight: 600, 
              backgroundColor: isRented ? '#FF8F8F' : '#B6FFA1', 
              pt: '5px', 
              pb: '5px', 
              pr: '5px', 
              pl: '5px', 
              borderRadius: '15px' 
            }}
            className="mb:text-sm tb:text-base"
          >
            {isRented ? 'Rented' : 'Available'}
          </Typography>

          {/* Buttons for More Details */}
          <div className="flex mb:flex-col tb:flex-row mb:items-center tb:items-center mb:gap-2 tb:gap-4">
            {isRented ? (
              <Button 
                variant="outlined" 
                sx={{ 
                  mt: 1, 
                  mr: 1, 
                  backgroundColor: "#3b82f6", 
                  color: "white", 
                  fontWeight: 500, 
                  fontSize:'.8rem',
                  letterSpacing: '1px' 
                }}
                onClick={handleOpenTenantDialog}
                className="mb:w-full tb:w-auto"
              >
                Tenant Info
              </Button>
            ) : (
              <Button 
                variant="contained"
                sx={{ 
                  mt: 1, 
                  mr: 1, 
                  backgroundColor: "#3b82f6", 
                  color: "white", 
                  fontWeight: 500, 
                  fontSize:'.8rem',
                  letterSpacing: '1px' 
                }}
                onClick={handleOpenApplicationDialog}
                className="mb:w-full tb:w-auto"
              >
                Apply now
              </Button>
            )}
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 1, 
                mr: 1, 
                backgroundColor: "#3b82f6", 
                color: "white", 
                fontWeight: 500, 
                fontSize:'.8rem',
                letterSpacing: '1px' 
              }}
              onClick={handleOpenRoomDialog}
              className="mb:w-full tb:w-auto"
            >
              Rental Terms
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Dialog */}
      <Dialog
        open={openApplicationDialog}
        onClose={handleCloseApplicationDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 3,
            backgroundColor: '#fff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle 
          sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', mb: 2 }}
          className="mb:text-lg tb:text-xl"
        >
          Apply for Room {roomNumber} in {property} Building
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={applicationData.fullName}
            onChange={(e) => setApplicationData({ ...applicationData, fullName: e.target.value })}
          />
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={applicationData.email}
            onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
          />
          <TextField
            label="Contact Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={applicationData.contactNumber}
            onChange={(e) => setApplicationData({ ...applicationData, contactNumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="contained"
            onClick={handleSubmitApplication}
            sx={{ backgroundColor: "#3b82f6", color: "white", px: 4, py: 1.5, borderRadius: '8px', fontWeight: 600 }}
            className="mb:text-sm tb:text-base"
          >
            Apply this Room
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 3,
            backgroundColor: '#fff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle 
          sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', mb: 2 }}
          className="mb:text-lg tb:text-xl"
        >
          Application Submitted!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
            We will contact you, Once the application is approved.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => setOpenSuccessDialog(false)}
            sx={{ backgroundColor: "#3b82f6", color: "white", px: 4, py: 1.5, borderRadius: '8px', fontWeight: 600 }}
            className="mb:text-sm tb:text-base"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tenant Info Dialog */}
      <Dialog
        open={openTenantDialog}
        onClose={handleCloseTenantDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#FEF9F2',
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            fontSize: '3rem', 
            fontWeight: '600', 
            textAlign: 'center', 
            color: '#0C1844',
            fontFamily: 'Playfair Display',
            mb: 1,
            letterSpacing: '1px'
          }}
          className="mb:text-2xl tb:text-3xl"
        >
          Tenant Information
        </DialogTitle>
        
        <DialogContent sx={{ py: 2 }}>
          {isRented && tenant ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                p: 2,
                borderRadius: '12px',
                backgroundColor: '#B9E5E8',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <DialogContentText sx={{ fontSize: '1.1rem', color: '#0C1844', fontWeight: '500', letterSpacing: '2px' }}>
                <strong>Name:</strong> {user?.role === 'tenant' ? anonymizeName(tenant.name) : tenant.name}
              </DialogContentText>
              <DialogContentText sx={{ fontSize: '1.1rem', color: '#0C1844', fontWeight: '500', letterSpacing: '2px' }}>
                <strong>Email:</strong> {user?.role === 'tenant' ? anonymizeEmail(tenant.email) : tenant.email}
              </DialogContentText>
              <DialogContentText sx={{ fontSize: '1.1rem', color: '#0C1844', fontWeight: '500', letterSpacing: '2px' }}>
                <strong>Phone:</strong> {user?.role === 'tenant' ? anonymizePhone(tenant.phone) : tenant.phone}
              </DialogContentText>
              <DialogContentText sx={{ fontSize: '1.1rem', color: '#0C1844', fontWeight: '500', letterSpacing: '2px' }}>
                <strong>Lease Start:</strong> {formattedLeaseStart}
              </DialogContentText>
              <DialogContentText sx={{ fontSize: '1.1rem', color: '#0C1844', fontWeight: '500', letterSpacing: '2px' }}>
                <strong>Lease End:</strong> {formattedLeaseEnd}
              </DialogContentText>
              <DialogContentText sx={{ fontSize: '1.1rem', color: '#0C1844', fontWeight: '500', letterSpacing: '2px' }}>
                <strong>Rent Amount:</strong> ₱{tenant.rentAmount}
              </DialogContentText>
            </Box>
          ) : (
            <DialogContentText
              sx={{
                fontSize: '1.2rem',
                fontWeight: '500',
                color: '#777',
                textAlign: 'center',
              }}
            >
              No tenant information available.
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleCloseTenantDialog}
            sx={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              px: 3,
              py: 1,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
            }}
            className="mb:text-sm tb:text-base"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Info Dialog */}
      <Dialog
        open={openRoomDialog}
        onClose={handleCloseRoomDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#FEF9F2',
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            textAlign: 'center', 
            color: '#0C1844',
            fontFamily: 'Playfair Display',
            letterSpacing: '1px',
            mb: 1
          }}
          className="mb:text-xl tb:text-2xl"
        >
          Terms and Conditions
        </DialogTitle>

        <DialogContent 
          sx={{ 
            maxHeight: '400px', 
            overflowY: 'auto', 
            py: 2
          }}
          className="mb:py-2 tb:py-3"
        >
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333', mb: 2 }}>
            1. <strong>Lease Agreement:</strong> The tenant agrees to occupy the rented premises for the lease term specified in the contract. Any early termination of the lease must be communicated in writing at least 30 days before the move-out date, and additional fees may apply as outlined in the contract.
            <br /><br />
            2. <strong>Rent Payment:</strong> Rent is due on the 1st of every month and must be paid in full by the 5th to avoid late fees. A late fee of ₱500 will be applied for payments made after the 5th of each month. Rent can be paid through bank transfer or other payment methods approved by management. Tenants must upload the payment receipt and reference number via the tenant portal for manual approval.
            <br /><br />
            3. <strong>Security Deposit:</strong> A security deposit equivalent to one month’s rent is required at the beginning of the lease. The security deposit will be refunded after move-out, provided there are no damages beyond normal wear and tear. Any damages or unpaid fees will be deducted from the deposit.
            <br /><br />
            4. <strong>Maintenance and Repairs:</strong> Tenants must notify the management of any needed repairs or maintenance through the tenant portal. Tenants are responsible for the care and upkeep of the apartment, including keeping it clean and reporting any damages immediately. Unauthorized repairs or alterations to the property are prohibited.
            <br /><br />
            5. <strong>Utilities:</strong> Water and electricity are metered individually for each apartment unit. Tenants are responsible for paying for these utilities based on usage. The tenant must pay all utility bills before the due date, and failure to do so may result in service disconnection or additional charges.
            <br /><br />
            6. <strong>Rules of Conduct:</strong> No illegal activities, excessive noise, or disturbances that affect the peace of the community are permitted. Guests are permitted, but overnight guests should not exceed 14 days without prior approval from management. Smoking and the use of illegal substances are strictly prohibited within the premises.
            <br /><br />
            7. <strong>Subletting:</strong> Subletting the apartment is not allowed unless specifically agreed upon by management in writing. Violating this term can lead to lease termination and forfeiture of the security deposit.
            <br /><br />
            8. <strong>Move-in/Move-out Inspections:</strong> A move-in inspection will be conducted by management, with a checklist signed by both parties. Upon move-out, an inspection will be conducted, and any damages or cleaning fees will be deducted from the security deposit.
            <br /><br />
            9. <strong>Termination and Eviction:</strong> The landlord reserves the right to terminate the lease agreement for non-payment of rent, violation of these terms, or illegal activities. Eviction procedures will follow the legal requirements outlined by local property laws.
            <br /><br />
            10. <strong>Renewal of Lease:</strong> Lease renewals must be agreed upon at least 30 days before the end of the current lease term. If the tenant chooses not to renew, a notice of non-renewal must be submitted in writing 30 days before the lease end date.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleCloseRoomDialog}
            sx={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              px: 3,
              py: 1,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
            }}
            className="mb:text-sm tb:text-base"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomCard;
