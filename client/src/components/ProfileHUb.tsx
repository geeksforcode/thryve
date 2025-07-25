import { Link } from "react-router-dom";

function ProfileHub() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">Profile Hub</h1>

      <div className="space-y-4">
        <Link to="/profiles">
          <button className="btn">View All Profiles</button>
        </Link>

        <Link to="/profile/dashboard">
          <button className="btn">Dashboard</button>
        </Link>

        <Link to="/profile/portfolio">
          <button className="btn">Portfolio</button>
        </Link>

        <Link to="/profile/joinus">
          <button className="btn">Join Us</button>
        </Link>

        <Link to="/profile/profilecontact">
          <button className="btn">Contact</button>
        </Link>
      </div>
    </div>
  );
}

export default ProfileHub;
