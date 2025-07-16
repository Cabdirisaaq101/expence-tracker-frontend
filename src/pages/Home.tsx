import { Link } from "react-router-dom";
import "../styles/Home.css";


export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Expense Tracker</h1>
      <p>
        <Link to="/login" className="home-link">Login</Link> or{" "}
        <Link to="/register" className="home-link">Register</Link> to continue.
      </p>
    </div>
  );
}
