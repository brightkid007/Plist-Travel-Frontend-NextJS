const FormInput = ({
  label,
  type,
  rows,
  name,
  gridClass = "col-12",
  otherClass = "",
  placeholder,
  options,
}) => {
  let form = (
    <input
      className="border-light rounded-8 py-5 px-15 w-full mt-10"
      type="text"
      placeholder={placeholder}
    />
  );

  switch (type) {
    case "textarea":
      form = (
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          rows={rows}
          placeholder={placeholder}
        ></textarea>
      );
      break;
    case "select":
      form = (
        <select
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          name={name}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case "checkbox":
      form = (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            {name}
          </label>
        </div>
      );
      break;
    case "radio":
      form = (
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            {name}
          </label>
        </div>
      );
      break;
    default:
      form = (
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder={placeholder}
        />
      );
      break;
  }

  return (
    <div className={`mt-5 ${gridClass} ${otherClass}`}>
      <h1 className="text-14 lh-12 fw-500">{label}</h1>
      {form}
    </div>
  );
};

export default FormInput;
