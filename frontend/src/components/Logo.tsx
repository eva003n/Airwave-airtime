import { Link } from "react-router-dom";
import logoImage from "/images/Airwave-logo.png";


const Logo = () => {
  return (
    <div className="flex gap-1 items-center">
      <img src={logoImage} width={50}/>
  
      <Link
        to="/"
        className={` text-3xl font-bold text-color tracking-wider`}
      >
        Airwave
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pl-2 bg-clip-text text-transparent">
          airtime
        </span>
      </Link>
    </div>
  );
};

export default Logo