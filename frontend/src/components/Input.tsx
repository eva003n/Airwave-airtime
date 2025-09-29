
const Input = ({  ...props }) => {
  return <input className={`bg-slate-100 w-full  border-none focus:outline-none  py-1.5 px-5  rounded-sm text-sm text-cokor ${props.className}`}{...props} >
  </input>;
};

export default Input;
