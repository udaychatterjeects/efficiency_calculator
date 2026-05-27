import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiQuery, apiRoute } from '../../api/apiClient';
import {
  Button, Dialog, DialogActions, DialogContent,
  FormControl, InputLabel, Select, MenuItem, IconButton,
  Chip, Slider, Typography, TextField,
} from '@mui/material';
import { CustomDialogTitle } from '../common/CustomDialogTitle';
import Cropper from 'react-easy-crop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import swal from 'sweetalert';

// ── Canvas helper ─────────────────────────────────────────────────────────────
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  canvas.getContext('2d').drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, 200, 200,
  );
  return canvas.toDataURL('image/jpeg', 0.85);
}

// ── Crop Dialog ───────────────────────────────────────────────────────────────
const CropDialog = ({ open, imageSrc, onClose, onDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <CustomDialogTitle id="crop-dialog" onClose={onClose}>Crop Photo</CustomDialogTitle>
      <DialogContent dividers style={{ padding: 0 }}>
        <div style={{ position: 'relative', width: '100%', height: 300, background: '#111' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div style={{ padding: '12px 24px 4px' }}>
          <Typography variant="caption" color="text.secondary">Zoom</Typography>
          <Slider value={zoom} min={1} max={3} step={0.05} onChange={(_, v) => setZoom(v)} size="small" />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button
          onClick={async () => { const b = await getCroppedImg(imageSrc, croppedAreaPixels); onDone(b); }}
          color="primary" variant="contained"
        >
          Use Photo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── Photo Picker (shared by Add & Edit) ───────────────────────────────────────
const PhotoPicker = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const [rawImage, setRawImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setRawImage(reader.result); setCropOpen(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={value || '/assets/img/dummy-profile-pic.jpg'}
            alt="profile"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #dee2e6' }}
          />
          {value && (
            <IconButton
              size="small"
              onClick={() => onChange('')}
              style={{ position: 'absolute', top: -6, right: -6, background: '#fff', padding: 2, border: '1px solid #ccc' }}
            >
              <CloseIcon style={{ fontSize: 14 }} />
            </IconButton>
          )}
        </div>
        <div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFile} />
          <Button variant="outlined" size="small" startIcon={<PhotoCameraIcon />} onClick={() => fileInputRef.current.click()}>
            {value ? 'Change Photo' : 'Upload Photo'}
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            Square crop, any image format
          </Typography>
        </div>
      </div>

      {rawImage && (
        <CropDialog
          open={cropOpen}
          imageSrc={rawImage}
          onClose={() => { setCropOpen(false); setRawImage(null); }}
          onDone={(b) => { onChange(b); setCropOpen(false); setRawImage(null); }}
        />
      )}
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const emptyForm = { email: '', password: '', firstname: '', lastname: '', role: 'user', profileImage: '' };

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    apiQuery(apiRoute.SuperAdmin.ListUsers)
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setUsers([]));
  }, [refresh]);

  // ── Add ──────────────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!addForm.email || !addForm.password) { alert('Email and password are required.'); return; }
    apiQuery({ ...apiRoute.SuperAdmin.AddUser, body: { ...addForm, profileImage: addForm.profileImage || null } })
      .then(res => {
        swal('Success!', res.data.message, 'success');
        setAddOpen(false);
        setAddForm(emptyForm);
        setRefresh(Math.random());
      })
      .catch(err => swal('Error', err?.response?.data?.message || 'Failed.', 'error'));
  };

  // ── Edit ─────────────────────────────────────────────────────────────────────
  const openEdit = (u) => {
    setEditForm({
      email: u.email,
      password: '',
      firstname: u.firstname,
      lastname: u.lastname,
      role: u.role,
      profileImage: u.profileImage || '',
    });
    setEditOpen(true);
  };

  const handleEdit = () => {
    const body = {
      email: editForm.email,
      firstname: editForm.firstname,
      lastname: editForm.lastname,
      role: editForm.role,
      profileImage: editForm.profileImage,
    };
    if (editForm.password) body.password = editForm.password;
    apiQuery({ ...apiRoute.SuperAdmin.UpdateUser, body })
      .then(res => {
        swal('Updated!', res.data.message, 'success');
        setEditOpen(false);
        setRefresh(Math.random());
      })
      .catch(err => swal('Error', err?.response?.data?.message || 'Failed.', 'error'));
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = (u) => {
    swal({
      title: 'Delete user?',
      text: `This will permanently remove ${u.email} and all their data.`,
      icon: 'warning', buttons: true, dangerMode: true,
    }).then(ok => {
      if (!ok) return;
      apiQuery({ ...apiRoute.SuperAdmin.DeleteUser, body: { email: u.email } })
        .then(res => { swal('Deleted!', res.data.message, 'success'); setRefresh(Math.random()); })
        .catch(() => swal('Error', 'Delete failed.', 'error'));
    });
  };

  // ── Activate / Deactivate ────────────────────────────────────────────────────
  const handleToggleActivation = (u) => {
    const action = u.status === 1 ? 'deactivate' : 'activate';
    swal({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} user?`,
      text: u.status === 0
        ? `Activating ${u.email} will clone all master STLC activities and AI solutions to this user.`
        : `This will block ${u.email} from logging in.`,
      icon: 'warning', buttons: true, dangerMode: u.status === 1,
    }).then(confirmed => {
      if (!confirmed) return;
      apiQuery({ ...apiRoute.SuperAdmin.ActivateUser, body: { email: u.email } })
        .then(res => { swal('Done!', res.data.message, 'success'); setRefresh(Math.random()); })
        .catch(() => swal('Error', 'Action failed.', 'error'));
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  const UserFormFields = ({ form, setForm, isEdit }) => (
    <>
      <PhotoPicker value={form.profileImage} onChange={v => setForm(f => ({ ...f, profileImage: v }))} />
      <TextField fullWidth label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} margin="dense" type="email" disabled={isEdit} />
      <TextField
        fullWidth
        label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
        value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        margin="dense" type="password"
      />
      <TextField fullWidth label="First Name" value={form.firstname} onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))} margin="dense" />
      <TextField fullWidth label="Last Name" value={form.lastname} onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))} margin="dense" />
      <FormControl fullWidth margin="dense">
        <InputLabel>Role</InputLabel>
        <Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} label="Role">
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  return (
    <div className="row mt-3">
      <div className="col-md-12">
        <div className="card card-round">
          <div className="card-header">
            <div className="card-head-row d-flex justify-content-between align-items-center">
              <div className="card-title">Users Management</div>
              <button className="btn action_button" onClick={() => { setAddForm(emptyForm); setAddOpen(true); }}>+ Add User</button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: 48 }}></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted">No users found.</td></tr>
                  )}
                  {users.map(u => (
                    <tr key={u.userId}>
                      <td>
                        <img
                          src={u.profileImage || '/assets/img/dummy-profile-pic.jpg'}
                          alt=""
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #dee2e6' }}
                        />
                      </td>
                      <td>{u.firstname} {u.lastname}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <Chip
                          label={u.status === 1 ? 'Active' : 'Inactive'}
                          color={u.status === 1 ? 'success' : 'default'}
                          size="small"
                        />
                      </td>
                      <td>{u.createdAt ? u.createdAt.slice(0, 10) : ''}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Button
                          size="small" variant="outlined"
                          color={u.status === 1 ? 'error' : 'success'}
                          onClick={() => handleToggleActivation(u)}
                          sx={{ mr: 0.5 }}
                        >
                          {u.status === 1 ? 'Deactivate' : 'Activate'}
                        </Button>
                        <IconButton size="small" onClick={() => openEdit(u)} title="Edit user">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(u)} title="Delete user">
                          <DeleteIcon fontSize="small" style={{ fill: 'red' }} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addOpen} maxWidth="sm" fullWidth onClose={() => setAddOpen(false)}>
        <CustomDialogTitle id="add-user-dialog" onClose={() => setAddOpen(false)}>Add New User</CustomDialogTitle>
        <DialogContent dividers>
          <UserFormFields form={addForm} setForm={setAddForm} isEdit={false} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} color="primary" variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} maxWidth="sm" fullWidth onClose={() => setEditOpen(false)}>
        <CustomDialogTitle id="edit-user-dialog" onClose={() => setEditOpen(false)}>Edit User</CustomDialogTitle>
        <DialogContent dividers>
          <UserFormFields form={editForm} setForm={setEditForm} isEdit={true} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEdit} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
