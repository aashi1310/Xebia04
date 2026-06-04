import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="notfound-page" id="page-not-found">
      <div className="notfound-code" aria-hidden="true">404</div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-home" id="btn-go-home">
        Back to Home
      </Link>
    </main>
  );
}
