import React, { useState, useEffect } from 'react';
import { apiQuery, apiRoute } from '../../api/apiClient';

const AddStlcEfforts = () => {
  const [projectCategory, setProjectCategory] = useState('');
  const [activityName, setActivityName] = useState('');
  const [effortBreakdown, setEffortBreakdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [stlcPhases, setStlcPhases] = useState([]);

  const projectCategories = [
    'Break-fix, Maintenance, Enhancements',
    'Greenfield Digital Transformation',
    'Platform Upgrade and Modernization',
  ];

  // Fetch existing STLC phases
  useEffect(() => {
    // fetchStlcPhases();
  }, []);

  const fetchStlcPhases = () => {
    apiQuery({
      ...apiRoute.Configuration.GetStlcPhases,
    })
      .then((response) => {
        setStlcPhases(response.data);
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Error fetching STLC phases.');
      });
  };

  const handleAddActivity = () => {
    if (!projectCategory) {
      alert('Please select a project category.');
      return;
    }
    if (!activityName.trim() || !effortBreakdown.trim()) {
      alert('Both Activity Name and Effort Breakdown are required.');
      return;
    }

    setLoading(true);
    apiQuery({
      ...apiRoute.Configuration.addStlcActivity,
      body: { projectCategory, activityName, effortBreakdown },
    })
      .then((response) => {
        alert(response.data.message);
        setActivityName('');
        setEffortBreakdown('');
        fetchStlcPhases(); // Refresh the list
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Error adding activity.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="card card-round">
      <div className="card-header">
        <div className="card-title">Configure STLC Phases</div>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="projectCategory">Project Category</label>
          <select
            id="projectCategory"
            className="form-control"
            value={projectCategory}
            onChange={(e) => setProjectCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {projectCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="activityName">Activity Name</label>
          <input
            type="text"
            id="activityName"
            className="form-control"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="Enter activity name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="effortBreakdown">Standard Effort Breakdown (%)</label>
          <input
            type="number"
            id="effortBreakdown"
            className="form-control"
            value={effortBreakdown}
            onChange={(e) => setEffortBreakdown(e.target.value)}
            placeholder="Enter effort breakdown"
          />
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={handleAddActivity}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Activity'}
        </button>
      </div>
      <div className="mt-4">
        <h5>Existing STLC Phases</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Project Category</th>
                <th>Phase</th>
                <th>Standard Effort Breakdown (%)</th>
              </tr>
            </thead>
            <tbody>
              {stlcPhases.length > 0 ? (
                stlcPhases.map((phase, index) => (
                  <tr key={index}>
                    <td>{phase.projectCategory}</td>
                    <td>{phase.activityName}</td>
                    <td>{phase.effortBreakdown}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No STLC phases added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddStlcEfforts;