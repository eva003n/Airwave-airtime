import React from 'react'

interface TextBoxProps extends React.HTMLAttributes<HTMLTextAreaElement> {
name: string,
value: string | string[],
placeholder: string | undefined,
maxLength?: number
}
const Textbox = ({...props}: TextBoxProps) => {
  return (
    <textarea
      autoCapitalize="on"
      autoCorrect="on"
      // value={Array.isArray(props.value)? "" : value}
      {...props}
      className={` rounded-md w-full bg-zinc-900 py-1.5 px-4 text-gray-400  focus:outline-none ${props.className} `}
    ></textarea>
  );
}

export default Textbox