import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  
} 

const Select = ({options, value, name, onSelect, ...props}: SelectProps) => {
  return (
    <select
      className={`bg-zinc-900 block p-2 outline:border-zinc-800 ${props.className}`}
      value={value}
      onChange={onSelect}
      name={name}

    >
      {options.map((option, index) => (
        <option value={option} key={index}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Select