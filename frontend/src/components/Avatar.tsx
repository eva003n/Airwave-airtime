import type { HTMLAttributes } from "react";
import { useAuth } from "../context/authcontext";
import LoaderComponent from "./Loader";

interface AvatarProps extends HTMLAttributes<HTMLElement> {
  width: number;
  loading?: boolean;

}


const Avatar = ({ width = 24, loading = false, ...props }: AvatarProps) => {
  const { user } = useAuth();

  return (
    <div
      className={`  bg-zinc-700/80 rounded-full  relative overflow-hidden ${props.className}`}
      style={{ width: `${width}px`, height: `${width}px` }}
    >
      {loading && (
        <div className="bg-black/90 absolute inset-0 flex justify-center items-center">
          <LoaderComponent width={width / 2} />
        </div>
      )}
      {/* <div className="h-full"> */}
        {user && user.avatar_url && (
          <img
            src={user.avatar_url}
            alt="user avatar image"
            className="h-full object-cover"
          />
        )}
      {/* </div> */}

      {/* {!user?.avatar.imageUrl && (
        <CircleUserRound size={width} strokeWidth={2} />
      )} */}
    </div>
  );
};

export default Avatar;
