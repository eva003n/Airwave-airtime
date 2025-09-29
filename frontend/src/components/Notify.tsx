import { Heart } from 'lucide-react'
import React from 'react'
import { useNotify } from '../context/Notification/notifyContext'

const Notify = () => {
    const {notification} = useNotify()
    console.log(notification)
  return (
    <div className="relative">
      <Heart size={24} />
      {notification && notification.length > 0 && (
        <div className="absolute w-2 aspect-square rounded-full bg-rose-600 top-0 right-0"></div>
       )} 
    </div>
  );
}

export default Notify