import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-color">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-color">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link
          to="/"
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pl-2 bg-clip-text text-transparent hover:underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
