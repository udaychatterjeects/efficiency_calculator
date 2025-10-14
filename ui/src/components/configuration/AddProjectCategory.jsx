import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";
import { apiQuery, apiRoute } from "../../api/apiClient";

const AddProjectCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch the list of categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiQuery(apiRoute.Configuration.GetCategory);
      if (response.status === 200) {
        // console.log("PPPP",response.data)
        setCategories(response.data);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("An error occurred while fetching categories.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      const response = await apiQuery({
        ...apiRoute.Configuration.addCategory,
        body: { name: categoryName },
      });

      if (response.status === 200) {
        setSuccessMessage("Project added successfully!");
        setCategoryName("");
        fetchCategories(); // Refresh the list after adding
      } else {
        setError("Failed to add category. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Project Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          fullWidth
          margin="normal"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
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
            Add Category
          </Button>
        </Box>
      </form>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Project Categories
      </Typography>
      <List>
        {categories.map((category, index) => (
          <ListItem key={index}>
            <ListItemText primary={category.catName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddProjectCategory;