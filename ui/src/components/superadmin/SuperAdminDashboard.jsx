import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { TabPanel } from '../common/TabPanel';
import UsersManagement from './UsersManagement';
import MasterActivities from './MasterActivities';
import MasterSolutions from './MasterSolutions';
import MasterCategories from './MasterCategories';

function a11yProps(index) {
  return { id: `sa-tab-${index}`, 'aria-controls': `sa-tabpanel-${index}` };
}

const SuperAdminDashboard = () => {
  const [tab, setTab] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('USER_ROLE') !== 'superadmin') navigate('/login');
  }, []);

  return (
    <div className="page-inner">
      {/* Header banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
          borderRadius: 12,
          padding: '24px 32px',
          marginBottom: 24,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className="fas fa-shield-alt" style={{ fontSize: 24, color: '#fff' }} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: '#fff' }}>
            Super Admin Dashboard
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.85, color: '#fff' }}>
            Manage users, categories, STLC activities &amp; AI solutions catalogue.
            Activating a user clones all master data to their account.
          </p>
        </div>
      </div>

      {/* Tabs card */}
      <div className="card card-round" style={{ overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: '#f8f9fa', borderBottom: 1, borderColor: '#dee2e6' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            scrollButtons
            indicatorColor="primary"
            textColor="primary"
            allowScrollButtonsMobile
            sx={{
              px: 2,
              '& .MuiTab-root': { fontWeight: 600, fontSize: 13, minHeight: 48 },
            }}
          >
            <Tab label="👥  Users" {...a11yProps(0)} />
            <Tab label="🗂  Categories" {...a11yProps(1)} />
            <Tab label="📋  STLC Activities" {...a11yProps(2)} />
            <Tab label="🤖  AI Solutions" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <div style={{ padding: '8px 16px 24px' }}>
          <TabPanel index={0} value={tab}><UsersManagement /></TabPanel>
          <TabPanel index={1} value={tab}><MasterCategories /></TabPanel>
          <TabPanel index={2} value={tab}><MasterActivities /></TabPanel>
          <TabPanel index={3} value={tab}><MasterSolutions /></TabPanel>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
