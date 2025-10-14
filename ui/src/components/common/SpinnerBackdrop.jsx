import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { Container, Stack } from '@mui/material';

export default function SpinnerBackdrop({ open, waitingText }) {
  return (
    <div>
      <Backdrop
        sx={{
          color: '#111',
          backgroundColor: 'rgb(250,250,250,0.9)',
          top:'6em',
          zIndex: theme => theme.zIndex.drawer + 1
        }}
        open={open}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 'bolder'
            
          }}
        >
          <CircularProgress />
          <span>
            {waitingText
              ? waitingText
              : 'Machine Learning engine is working on predictive analytics . . .'}
          </span>
          <span
            style={{
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              color: 'red'
            }}
          >
            Please do not Refresh, Back or Click any other links while
            processing.
          </span>
        </section>
      </Backdrop>
    </div>
  );
}
