import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { apiQuery, apiRoute } from "../../api/apiClient";

const AddPhase = () => {
  const [phaseName, setPhaseName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [phases, setPhases] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch the list of categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchPhases();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiQuery(apiRoute.Configuration.GetCategory);
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("cAn error occurred while fetching categories.");
    }
  };

  const fetchPhases = async () => {
    try {
      const response = await apiQuery(apiRoute.Configuration.GetPhases);
      if (response.status === 200) {
        setPhases(response.data);
      } else {
        setError("Failed to fetch phases.");
      }
    } catch (err) {
      setError("aAn error occurred while fetching phases.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!phaseName.trim() || !selectedCategory) {
      setError("Both phase name and category are required.");
      return;
    }

    try {
      const response = await apiQuery({
        ...apiRoute.Configuration.addPhase,
        body: { phaseName, categoryId: selectedCategory },
      });

      if (response.status === 200) {
        setSuccessMessage("Phase added successfully!");
        setPhaseName("");
        setSelectedCategory("");
        fetchPhases(); // Refresh the list after adding
      } else {
        setError("Failed to add phase. Please try again.");
      }
    } catch (err) {
      setError("bAn error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Phase
      </Typography>
      <FormControl fullWidth margin="normal">
          <InputLabel id="category-select-label">Project Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.catId} value={category.catId}>
                {category.catName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Phase Name"
          fullWidth
          margin="normal"
          value={phaseName}
          onChange={(e) => setPhaseName(e.target.value)}
          required
        />
        
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" variant="body2" gutterBottom>
            {successMessage}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Add Phase
          </Button>
        </Box>
      </form>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Phases
      </Typography>
      <List>
        {phases.map((phase, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${phase.phaseName} (Category: ${phase.categoryName})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddPhase;