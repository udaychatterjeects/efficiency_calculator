import React, { useEffect, useState } from 'react';
import { apiQuery, apiRoute } from '../../api/apiClient';
import {
  Button, Dialog, DialogActions, DialogContent,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton,
} from '@mui/material';
import { CustomDialogTitle } from '../common/CustomDialogTitle';
import { ThemeProvider } from '@mui/material/styles';
import MUIDataTable from 'mui-datatables';
import { getSolutionTablesTheme } from '../common/DataTableStyles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import swal from 'sweetalert';

const emptyForm = {
  id: null, catelog: '', stlcName: '', solutionCategory: '', solutionType: '',
  licenseType: '', licsensingCost: '', frequency: '', effortSavings: '',
  shortDesc: '', adoptionPer: '',
};

const MasterSolutions = () => {
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    apiQuery(apiRoute.SuperAdmin.ListSolutions)
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRows([]));
  }, [refresh]);

  const openAdd = () => { setForm(emptyForm); setIsEdit(false); setDialogOpen(true); };

  const openEdit = (row) => {
    setForm({
      id: row.id, catelog: row.catelog, stlcName: row.stlcName,
      solutionCategory: row.solutionCategory, solutionType: row.solutionType,
      licenseType: row.licenseType, licsensingCost: row.licsensingCost,
      frequency: row.frequency, effortSavings: row.effortSavings,
      shortDesc: row.shortDesc, adoptionPer: row.adoptionPer,
    });
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.catelog || !form.stlcName) { alert('Solution name and STLC Activity are required.'); return; }
    const route = isEdit ? apiRoute.SuperAdmin.UpdateSolution : apiRoute.SuperAdmin.AddSolution;
    apiQuery({ ...route, body: form })
      .then(res => {
        swal('Success!', res.data.message, 'success');
        setDialogOpen(false);
        setRefresh(Math.random());
      })
      .catch(() => swal('Error', 'Action failed.', 'error'));
  };

  const handleDelete = (id) => {
    swal({ title: 'Delete solution?', text: 'This cannot be undone.', icon: 'warning', buttons: true, dangerMode: true })
      .then(ok => {
        if (!ok) return;
        apiQuery({ ...apiRoute.SuperAdmin.DeleteSolution, body: { id } })
          .then(res => { swal('Deleted!', res.data.message, 'success'); setRefresh(Math.random()); })
          .catch(() => swal('Error', 'Delete failed.', 'error'));
      });
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm(prev => ({ ...prev, [key]: e.target.value })) });

  const columns = [
    { name: 'id', label: 'ID', options: { display: false } },
    { name: 'catelog', label: 'Solution Name' },
    { name: 'stlcName', label: 'STLC Activity' },
    { name: 'solutionCategory', label: 'Category' },
    { name: 'solutionType', label: 'Type' },
    { name: 'licenseType', label: 'License' },
    { name: 'effortSavings', label: 'Effort Savings (%)' },
    {
      name: 'Actions',
      options: {
        filter: false, sort: false, download: false,
        customBodyRender: (_, tableMeta) => {
          const row = rows[tableMeta.rowIndex];
          return (
            <span>
              <IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" style={{ fill: 'red' }} /></IconButton>
            </span>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: 'none', filter: false, print: false, download: false,
    viewColumns: false, search: true, rowsPerPage: 10, elevation: 0,
    responsive: 'simple',
  };

  return (
    <div className="row mt-3">
      <div className="col-md-12">
        <ThemeProvider theme={getSolutionTablesTheme()}>
          <MUIDataTable
            title={
              <div className="button-header">
                <button className="btn action_button" onClick={openAdd}>+ Add Solution</button>
              </div>
            }
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>

      <Dialog open={dialogOpen} maxWidth="md" fullWidth onClose={() => setDialogOpen(false)}>
        <CustomDialogTitle id="solution-dialog" onClose={() => setDialogOpen(false)}>
          {isEdit ? 'Edit Solution' : 'Add Solution'}
        </CustomDialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Solution Name" margin="dense" {...f('catelog')} />
          <TextField fullWidth label="STLC Activity Name" margin="dense" {...f('stlcName')} />
          <TextField fullWidth label="Description (max 500 chars)" margin="dense" multiline minRows={3} inputProps={{ maxLength: 500 }} {...f('shortDesc')} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <FormControl style={{ flex: 1 }} margin="dense">
              <InputLabel>Solution Type</InputLabel>
              <Select value={form.solutionType} onChange={e => setForm(p => ({ ...p, solutionType: e.target.value }))} label="Solution Type">
                <MenuItem value="Predictive AI">Predictive AI</MenuItem>
                <MenuItem value="Generative AI">Generative AI</MenuItem>
              </Select>
            </FormControl>
            <FormControl style={{ flex: 1 }} margin="dense">
              <InputLabel>Solution Category</InputLabel>
              <Select value={form.solutionCategory} onChange={e => setForm(p => ({ ...p, solutionCategory: e.target.value }))} label="Solution Category">
                <MenuItem value="Cognizant: Prototype">Cognizant: Prototype</MenuItem>
                <MenuItem value="Cognizant: Industrialized">Cognizant: Industrialized</MenuItem>
                <MenuItem value="External">External</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <FormControl style={{ flex: 1 }} margin="dense">
              <InputLabel>License Type</InputLabel>
              <Select value={form.licenseType} onChange={e => setForm(p => ({ ...p, licenseType: e.target.value }))} label="License Type">
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Licensed">Licensed</MenuItem>
              </Select>
            </FormControl>
            <TextField style={{ flex: 1 }} label="License Cost ($)" margin="dense" type="number" {...f('licsensingCost')} />
            <FormControl style={{ flex: 1 }} margin="dense">
              <InputLabel>License Term</InputLabel>
              <Select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))} label="License Term">
                <MenuItem value="Month">Month</MenuItem>
                <MenuItem value="Year">Year</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <TextField style={{ flex: 1 }} label="Effort Savings (%)" margin="dense" type="number" {...f('effortSavings')} />
            <TextField style={{ flex: 1 }} label="Adoption Planned (%)" margin="dense" type="number" {...f('adoptionPer')} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MasterSolutions;
