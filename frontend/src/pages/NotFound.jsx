import { Link } from "react-router-dom";

function NotFound() {
 return (
 <div className="page not-found-page">
 <h1>404</h1>
 <h2>PAGE NOT FOUND</h2>
 <p>The page you are looking for does not exist.</p>
 <Link to="/" className="btn-home">GO BACK HOME &rarr;</Link>
 </div>
 );
}

export default NotFound;
