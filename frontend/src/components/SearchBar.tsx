import React from 'react'
import Input from './Input'

const SearchBar = () => {
  return (
    <div className='grow'>
      <Input type="text" className="bg-zinc-700 w-full py-1.5 rounded-lg" />
    </div>
  );
}

export default SearchBar