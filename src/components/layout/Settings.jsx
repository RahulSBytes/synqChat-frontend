import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  
  return (
    <div className="settings-page">
      <button 
        className="close-btn"
        onClick={() => navigate(-1)}
      >
        ✕
      </button>
      
      <h1>Settings</h1>
    </div>
  );
}