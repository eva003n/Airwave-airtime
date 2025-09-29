const ToggleSwitch = () => {
  return (
    <label className="toggle-switch bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
      <input type="checkbox" className="border-none"/>
      <div className="toggle-switch-background">
        <div className="toggle-switch-handle"></div>
      </div>
    </label>
  );
}

export default ToggleSwitch