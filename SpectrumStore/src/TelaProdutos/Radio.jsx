import './Radio.css';

const Radio = ({ groupName }) => {
  return (
      <div className="rating">
        <input defaultValue={5} name={groupName} id={`${groupName}-star5`} type="radio" />
        <label title="text" htmlFor={`${groupName}-star5`} />
        <input defaultValue={4} name={groupName} id={`${groupName}-star4`} type="radio" />
        <label title="text" htmlFor={`${groupName}-star4`} />
        <input defaultValue={3} name={groupName} id={`${groupName}-star3`} type="radio" defaultChecked />
        <label title="text" htmlFor={`${groupName}-star3`} />
        <input defaultValue={2} name={groupName} id={`${groupName}-star2`} type="radio" />
        <label title="text" htmlFor={`${groupName}-star2`} />
        <input defaultValue={1} name={groupName} id={`${groupName}-star1`} type="radio" />
        <label title="text" htmlFor={`${groupName}-star1`} />
      </div>
  );
}


export default Radio;
