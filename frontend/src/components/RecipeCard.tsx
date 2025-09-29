import React from 'react'
import Avatar from './Avatar'

const RecipeCard = () => {
  return (
    <div>
        <div>
            <Avatar width={40}/>
            <p className='text-2xl text-white my-2'>Lorem ipsum dolor sit amet.</p>
        </div>
        <div className='bg-zinc-950 rounded-sm w-[150px] aspect-square'>

        </div>
        <div></div>
    </div>
  )
}

export default RecipeCard