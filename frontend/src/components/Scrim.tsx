import React, { useState } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Scrim:React.FC<{children: React.ReactNode, buttonText: boolean, onAction?:(e: any) => {}, onClose: () => void, action?: string}> = ({children, buttonText= false, onAction, onClose,action = "Done"}) => {

  
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="w-[90%] max-w-[24rem] bg-zinc-800 aspect-square relative p-4 rounded-sm grid gap-4 ">
        {!buttonText && (
          <Button icon={X} value="" className="absolute top-0 right-0  w-min" onClick={onClose} />
        )}
        <div className='grid gap-8  py-5 text-gray-400'>{children}</div>
        {buttonText && (
          <div className="flex justify-end self-end ">
            <Button
              value={action}
              className="w-min bg-amber-600 px-2 py-1"
              onClick={action === "Done"? onClose: onAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Scrim