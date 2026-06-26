import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRepository } from '../services/githubUserApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './CreateRepository.css';

export default function CreateRepository() {
  const { isGithubAuth, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    private: false,
    auto_init: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Repository name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const repo = await createRepository(formData);
      // On success, redirect to the new repository manager page
      navigate(`/my-profile/repos/${repo.owner.login}/${repo.name}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (isAuthLoading) {
    return <div className="page-container"><LoadingSpinner /></div>;
  }

  if (!isGithubAuth) {
    return <div className="page-container">Please login with GitHub first.</div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="create-repo-wrapper">
        <Link to="/my-profile" className="back-link mb-4 d-inline-block">
          ← Back to Profile
        </Link>
        
        <div className="glass-card p-5">
          <div className="mb-4">
            <h1 className="mb-2">Create a new repository</h1>
            <p className="text-secondary">
              A repository contains all project files, including the revision history.
            </p>
          </div>

          {error && <ErrorMessage message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="create-repo-form">
            <div className="form-group mb-4">
              <label htmlFor="name" className="d-block mb-2 fw-bold">
                Repository name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control glass-input w-100"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. awesome-project"
                autoFocus
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="description" className="d-block mb-2 fw-bold">
                Description <span className="text-tertiary fw-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="form-control glass-input w-100"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of your project"
              />
            </div>

            <hr className="glass-divider my-4" />

            <div className="form-options mb-4">
              <label className="radio-container mb-3 d-flex align-items-start gap-3">
                <input
                  type="radio"
                  name="private"
                  value="false"
                  checked={formData.private === false}
                  onChange={() => setFormData(prev => ({ ...prev, private: false }))}
                />
                <div>
                  <div className="fw-bold d-flex align-items-center gap-2">
                    <span className="icon">🌐</span> Public
                  </div>
                  <div className="text-secondary text-sm">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </div>
                </div>
              </label>

              <label className="radio-container d-flex align-items-start gap-3">
                <input
                  type="radio"
                  name="private"
                  value="true"
                  checked={formData.private === true}
                  onChange={() => setFormData(prev => ({ ...prev, private: true }))}
                />
                <div>
                  <div className="fw-bold d-flex align-items-center gap-2">
                    <span className="icon">🔒</span> Private
                  </div>
                  <div className="text-secondary text-sm">
                    You choose who can see and commit to this repository.
                  </div>
                </div>
              </label>
            </div>

            <hr className="glass-divider my-4" />

            <div className="form-group mb-4">
              <label className="checkbox-container d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  name="auto_init"
                  checked={formData.auto_init}
                  onChange={handleChange}
                />
                <span className="fw-bold">Initialize this repository with a README</span>
              </label>
              <div className="text-secondary text-sm ms-4 mt-1">
                This will let you immediately clone the repository to your computer.
              </div>
            </div>

            <div className="form-actions mt-5">
              <button
                type="submit"
                className="btn btn-primary w-100 py-3 d-flex justify-content-center align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" /> Creating repository...
                  </>
                ) : (
                  'Create repository'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
