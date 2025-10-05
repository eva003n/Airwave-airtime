const ToggleSwitch = () => {
  return (
    <label
      htmlFor="acceptConditions"
      className="relative inline-flex h-6 w-12 cursor-pointer items-center"
    >
      <input type="checkbox" id="acceptConditions" className="peer sr-only" />

      {/* Track */}
      <span className="absolute h-6 w-12 rounded-full bg-gray-300 transition-colors peer-checked:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 peer-focus:ring-2 peer-focus:ring-gray-400 peer-focus:outline-none"></span>

      {/* Knob */}
      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-6"></span>
    </label>
  );
}

export default ToggleSwitch