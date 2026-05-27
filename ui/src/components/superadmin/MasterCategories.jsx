import React, { useEffect, useState } from 'react';
import { apiQuery, apiRoute } from '../../api/apiClient';
import {
  Button, Dialog, DialogActions, DialogContent,
  TextField, Chip, IconButton,
} from '@mui/material';
import { CustomDialogTitle } from '../common/CustomDialogTitle';
import { ThemeProvider } from '@mui/material/styles';
import MUIDataTable from 'mui-datatables';
import { getSolutionTablesTheme } from '../common/DataTableStyles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import swal from 'sweetalert';

const emptyForm = { id: null, name: '' };

const MasterCategories = () => {
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    apiQuery(apiRoute.SuperAdmin.ListCategories)
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRows([]));
  }, [refresh]);

  const openAdd = () => { setForm(emptyForm); setIsEdit(false); setDialogOpen(true); };

  const openEdit = (row) => {
    setForm({ id: row.id, name: row.name });
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert('Category name is required.'); return; }
    const route = isEdit ? apiRoute.SuperAdmin.UpdateCategory : apiRoute.SuperAdmin.AddCategory;
    apiQuery({ ...route, body: form })
      .then(res => {
        swal('Success!', res.data.message, 'success');
        setDialogOpen(false);
        setRefresh(Math.random());
      })
      .catch(err => swal('Error', err?.response?.data?.message || 'Action failed.', 'error'));
  };

  const handleDelete = (id) => {
    swal({ title: 'Delete category?', text: 'This cannot be undone.', icon: 'warning', buttons: true, dangerMode: true })
      .then(ok => {
        if (!ok) return;
        apiQuery({ ...apiRoute.SuperAdmin.DeleteCategory, body: { id } })
          .then(res => { swal('Deleted!', res.data.message, 'success'); setRefresh(Math.random()); })
          .catch(() => swal('Error', 'Delete failed.', 'error'));
      });
  };

  const columns = [
    { name: 'id', label: 'ID', options: { display: false } },
    { name: 'name', label: 'Category Name' },
    {
      name: 'status', label: 'Status',
      options: {
        customBodyRender: v => (
          <Chip
            label={v === 1 ? 'Active' : 'Inactive'}
            size="small"
            style={{
              background: v === 1 ? '#e6f4ea' : '#fce8e6',
              color: v === 1 ? '#1e7e34' : '#c62828',
              fontWeight: 600,
            }}
          />
        ),
      },
    },
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
                <button className="btn action_button" onClick={openAdd}>+ Add Category</button>
              </div>
            }
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>

      <Dialog open={dialogOpen} maxWidth="sm" fullWidth onClose={() => setDialogOpen(false)}>
        <CustomDialogTitle id="category-dialog" onClose={() => setDialogOpen(false)}>
          {isEdit ? 'Edit Category' : 'Add Category'}
        </CustomDialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Category Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            margin="dense"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MasterCategories;
