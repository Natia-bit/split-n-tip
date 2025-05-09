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

  function updateBill(id, bill) {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, bill: parseFloat(bill) || 0 } : person
      )
    );
  }

  function updateTip(id, tip) {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, tip: parseFloat(tip) || 0 } : person
      )
    );
  }

  return (
    <div className="App">
      <MainTitle>Split & Tip</MainTitle>
      <div className="slip-container">
        <Bill people={people} />
        <PeopleList
          people={people}
          onUpdateTip={updateTip}
          onUpdateBill={updateBill}
        />
      </div>
    </div>
  );
}

function Bill({ people }) {
  const grandTotal = people.reduce(
    (sum, person) => sum + person.bill + person.tip,
    0
  );

  return (
    <div className="slip">
      <Title>Bill</Title>
      <label>Bill amount</label>
      <input type="text" />

      <CostDisplay price={grandTotal.toFixed(2)}>Final Bill</CostDisplay>
      <p className="person-bill-output"></p>
      <p>Final payment details including tips</p>
      {people.map((p) => (
        <PersonSummary
          key={p.id}
          name={p.name}
          amount={(p.bill + p.tip).toFixed(2)}
        />
      ))}
    </div>
  );
}

function PersonSummary({ name, amount }) {
  return (
    <div className="person-bill-output">
      {name} <span>R {amount}</span>
    </div>
  );
}

function PeopleList({ people, onUpdateTip, onUpdateBill }) {
  return (
    <div className="slip">
      <Title>People</Title>
      {people.map((person) => (
        <Person
          key={person.id}
          person={person}
          onUpdateTip={onUpdateTip}
          onUpdateBill={onUpdateBill}
        />
      ))}
    </div>
  );
}

function Person({ person, onUpdateTip, onUpdateBill }) {
  const total = person.bill + person.tip;
  const [inputValue, setInputValue] = useState("");

  function handleItemInput(e) {
    const newValue = e.target.value;
    setInputValue(newValue);

    const items = newValue
      .split(",")
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    const sum = items.reduce((a, b) => a + b, 0);
    onUpdateBill(person.id, sum);
  }

  return (
    <div className="person">
      <h3>{person.name}</h3>
      <CostDisplay price={total.toFixed(2)}>Grand Total:</CostDisplay>
      <ItemInput
        person={person}
        value={inputValue}
        onChange={handleItemInput}
      />
      <Tip
        tip={person.tip}
        onTipChange={(tip) => onUpdateTip(person.id, tip)}
        total={total}
      />
    </div>
  );
}

function ItemInput({ person, value, onChange }) {
  return (
    <div className="person-items">
      <label>What did you have?</label>
      <input type="text" value={value} onChange={onChange} />
      <CostDisplay price={person.bill.toFixed(2)}>Total amount: </CostDisplay>
    </div>
  );
}

function Tip({ tip, onTipChange, total }) {
  const [customTip, setCustomTip] = useState(0);
  const [isCustom, setIsCustom] = useState(false);

  function handlePercentageChange(e) {
    if (e.target.value === "custom") {
      setIsCustom(true);
      onTipChange(Number(customTip));
    } else {
      setIsCustom(false);
      onTipChange(Number(e.target.value));
    }
  }

  function handleCustomInput(e) {
    const value = Number(e.target.value);
    setCustomTip(value);
    onTipChange(value);
  }

  return (
    <div className="tip">
      <CostDisplay price={tip.toFixed(2)}>Total Tip</CostDisplay>
      <label>Tip Selection</label>
      <select
        value={isCustom ? "custom" : tip}
        onChange={handlePercentageChange}
      >
        <option value={(0 * total) / 100}>0%</option>
        <option value={(5 * total) / 100}>5%</option>
        <option value={(10 * total) / 100}>10%</option>
        <option value={(15 * total) / 100}>15%</option>
        <option value="custom">Custom</option>
      </select>
      {isCustom && (
        <input
          type="number"
          value={customTip}
          onChange={handleCustomInput}
          placeholder="Enter custom tip"
        />
      )}
    </div>
  );
}
