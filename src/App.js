import { useState } from "react";

const data = [
  {
    id: 1,
    name: "Dude One",
    bill: 0,
    tip: 0,
  },
  {
    id: 2,
    name: "Dude Two",
    bill: 0,
    tip: 0,
  },
];

function MainTitle({ children }) {
  return <h1>{children}</h1>;
}

function Title({ children }) {
  return <h2>{children}</h2>;
}

function CostDisplay({ price, children }) {
  return (
    <div>
      <p className="person-bill-output">
        {children} <span>R {price}</span>
      </p>
    </div>
  );
}

export default function App() {
  const [people, setPeople] = useState(data);
  const [inputValue, setInputValues] = useState({});

  function listItems(id, input) {
    setInputValues((prevInputs) => ({ ...prevInputs, [id]: input }));

    const sumArray = input
      .split(",")
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    const sum = sumArray.reduce((a, b) => a + b, 0);

    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, bill: sum } : person
      )
    );
  }

  return (
    <div className="App">
      <MainTitle>Split & Tip</MainTitle>
      <div className="slip-container">
        <Bill></Bill>
        <PeopleList
          people={people}
          inputValue={inputValue}
          onListItems={listItems}
        ></PeopleList>
      </div>
    </div>
  );
}

function Bill() {
  return (
    <div className="slip">
      <Title>Bill</Title>
      <label>Bill amount</label>
      <input type="text"></input>

      <CostDisplay price={"xx"}>Final Bill</CostDisplay>
      <p className="person-bill-output">
        Final bill <span>R XX</span>
      </p>
      <p>Final payment details including tips </p>
      <PersonBillOutputText name="Dude One"></PersonBillOutputText>
      <PersonBillOutputText name="Dude Two"></PersonBillOutputText>
    </div>
  );
}

function PersonBillOutputText({ name }) {
  return (
    <div className="person-bill-output">
      {name} <span>R XX</span>
    </div>
  );
}

function PeopleList({ people, onListItems, inputValue }) {
  return (
    <div className="slip">
      <Title>People</Title>
      {people.map((person) => (
        <Person
          key={person.id}
          person={person}
          name={person.name}
          onListItems={onListItems}
          inputValue={inputValue}
        ></Person>
      ))}
    </div>
  );

  function Person({ person, inputValue, onListItems }) {
    const [tip, setTip] = useState(person.tip);
    const grandTotal = person.bill + tip;

    // function handleInputChange(e) {
    //   onListItems(person.id, e.target.value);
    // }

    function handleTipChange(e) {
      setTip(Number(e.target.value));
    }

    return (
      <div className="person">
        <h3>{person.name}</h3>
        <CostDisplay price={person.bill.toFixed(2)}>Grand Total:</CostDisplay>
        <PersonsItems
          key={person.id}
          person={person}
          onListItems={(e) => onListItems(person.id, e.target.value)}
          inputValue={inputValue[person.id] || ""}
        ></PersonsItems>
        <Tip tip={tip} onTipChange={handleTipChange} pTotal={grandTotal}></Tip>
      </div>
    );
  }
}

function PersonsItems({ person, onListItems, inputValue }) {
  return (
    <div className="person-items">
      <label>What did you have?</label>
      <input
        type="text"
        key={person.id}
        value={inputValue || " "}
        onChange={onListItems}
      ></input>
      <CostDisplay price={person.bill.toFixed(2)}>Total amount: </CostDisplay>
    </div>
  );
}

function Tip({ tip, pTotal, onTipChange }) {
  const [customValue, setCustomValue] = useState(0);
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  function handleSelectChange(e) {
    if (e.target.value === "custom") {
      setIsCustomSelected(true);
      onTipChange({ target: { value: customValue || 0 } });
    } else {
      setIsCustomSelected(false);
      onTipChange(e);
    }
  }

  function handleCustomTip(e) {
    setCustomValue(e.target.value);
    onTipChange({ target: { value: e.target.value } });
  }

  return (
    <div className="tip">
      <CostDisplay price={tip.toFixed(2)}>Total Tip</CostDisplay>
      <label>Tip Selection</label>
      <select
        value={isCustomSelected ? "custom" : tip}
        onChange={handleSelectChange}
      >
        <option value={(0 * pTotal) / 100}> 0% </option>
        <option value={(5 * pTotal) / 100}> 5% </option>
        <option value={(10 * pTotal) / 100}> 10% </option>
        <option value={(15 * pTotal) / 100}> 15% </option>
        <option value="custom">Custom</option>
      </select>
      {isCustomSelected && (
        <input
          type="number"
          value={customValue}
          onChange={handleCustomTip}
          placeholder="Enter custom tip"
        ></input>
      )}
    </div>
  );
}
