import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AddStlcEfforts from './AddStlcEfforts';
import StlcEfforts from './StlcEfforts';
import AiSolutions from './AiSolutions';
import AddProjectCategory from './AddProjectCategory';
import AddPhase from './AddPhase';
import AddStlcPhase from './AddStlcPhase';
import { apiQuery, apiRoute } from '../../api/apiClient';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { TabPanel } from '../common/TabPanel';

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  };
}
const Configuration = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="page-inner">
      <React.Fragment>
        <Box
          sx={{
            backgroundColor: '#f5f5f557',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            scrollButtons
            indicatorColor="primary"
            textColor="primary"
            allowScrollButtonsMobile

          >

            {/* <Tab label="Add STLC Effort" {...a11yProps(0)}  /> */}
            
            {/* <Tab label="Project Category" {...a11yProps(0)}  />
            <Tab label="Phase" {...a11yProps(1)}  /> */}
            {/* <Tab label="STLC Efforts" {...a11yProps(0)} /> */}
            <Tab label="STLC Activities" {...a11yProps(0)}  />
            <Tab label="AI Solutions catalogue" {...a11yProps(1)}  />

          </Tabs>
        </Box>

        {/* <TabPanel index={0} value={value}  >
          <AddStlcEfforts />
        </TabPanel> */}
        {/* <TabPanel index={0} value={value}  >
          <AddProjectCategory />
        </TabPanel>
        <TabPanel index={1} value={value}  >
          <AddPhase />
        </TabPanel> */}
        {/* <TabPanel index={0} value={value}>
          <AddStlcPhase />
        </TabPanel> */}
        <TabPanel index={0} value={value}  >
          <StlcEfforts />
        </TabPanel>
        
        <TabPanel index={1} value={value} >
          <AiSolutions />
        </TabPanel>
      </React.Fragment>
    </div>
  );
};

export default Configuration;