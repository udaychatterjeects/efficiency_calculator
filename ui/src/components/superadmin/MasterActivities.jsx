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

const PHASE_LABELS = { 1: 'Phase 1 - Planning', 2: 'Phase 2 - Design', 3: 'Phase 3 - Execution', 4: 'Phase 4 - Review' };

const emptyForm = { id: null, phase: '', stlcName: '', catName: '', standardBreakup: '' };

const MasterActivities = () => {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    apiQuery(apiRoute.SuperAdmin.ListCategories)
      .then(res => {
        const cats = Array.isArray(res.data) ? res.data.map(c => c.name) : [];
        setCategories(cats);
        setForm(f => ({ ...f, catName: f.catName || cats[0] || '' }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    apiQuery(apiRoute.SuperAdmin.ListActivities)
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRows([]));
  }, [refresh]);

  const openAdd = () => { setForm({ ...emptyForm, catName: categories[0] || '' }); setIsEdit(false); setDialogOpen(true); };

  const openEdit = (row) => {
    setForm({ id: row.id, phase: row.phase, stlcName: row.stlcName, catName: row.catName, standardBreakup: row.standardBreakup });
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.phase || !form.stlcName || !form.standardBreakup) { alert('All fields are required.'); return; }
    const route = isEdit ? apiRoute.SuperAdmin.UpdateActivity : apiRoute.SuperAdmin.AddActivity;
    apiQuery({ ...route, body: form })
      .then(res => {
        swal('Success!', res.data.message, 'success');
        setDialogOpen(false);
        setRefresh(Math.random());
      })
      .catch(() => swal('Error', 'Action failed.', 'error'));
  };

  const handleDelete = (id) => {
    swal({ title: 'Delete activity?', text: 'This cannot be undone.', icon: 'warning', buttons: true, dangerMode: true })
      .then(ok => {
        if (!ok) return;
        apiQuery({ ...apiRoute.SuperAdmin.DeleteActivity, body: { id } })
          .then(res => { swal('Deleted!', res.data.message, 'success'); setRefresh(Math.random()); })
          .catch(() => swal('Error', 'Delete failed.', 'error'));
      });
  };

  const columns = [
    { name: 'id', label: 'ID', options: { display: false } },
    { name: 'phase', label: 'Phase', options: { customBodyRender: v => PHASE_LABELS[v] || `Phase ${v}` } },
    { name: 'stlcName', label: 'Activity Name' },
    { name: 'catName', label: 'Category' },
    { name: 'standardBreakup', label: 'Benchmark Effort (%)' },
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
                <button className="btn action_button" onClick={openAdd}>+ Add Activity</button>
              </div>
            }
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>

      <Dialog open={dialogOpen} maxWidth="sm" fullWidth onClose={() => setDialogOpen(false)}>
        <CustomDialogTitle id="activity-dialog" onClose={() => setDialogOpen(false)}>
          {isEdit ? 'Edit Activity' : 'Add Activity'}
        </CustomDialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="dense">
            <InputLabel>Phase</InputLabel>
            <Select value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))} label="Phase">
              <MenuItem value={1}>Phase 1 - Planning</MenuItem>
              <MenuItem value={2}>Phase 2 - Design</MenuItem>
              <MenuItem value={3}>Phase 3 - Execution</MenuItem>
              <MenuItem value={4}>Phase 4 - Review</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Activity Name" value={form.stlcName} onChange={e => setForm(f => ({ ...f, stlcName: e.target.value }))} margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select value={form.catName} onChange={e => setForm(f => ({ ...f, catName: e.target.value }))} label="Category">
              {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Benchmark Effort (%)" value={form.standardBreakup} onChange={e => setForm(f => ({ ...f, standardBreakup: e.target.value }))} margin="dense" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MasterActivities;
