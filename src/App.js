import { useEffect, useState } from "react";

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
    <div className="cost-display">
      <p className="person-summary">
        {children} <span>R {price}</span>
      </p>
    </div>
  );
}

export default function App() {
  const [people, setPeople] = useState(data);
  const [resetSignal, setResetSignal] = useState(0);

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

  function resetAll() {
    setPeople((prevPeople) =>
      prevPeople.map((person) => ({ ...person, bill: 0, tip: 0 }))
    );

    setResetSignal((prev) => prev + 1);
  }

  return (
    <div className="layout">
      <div className="App">
        <NavBar people={people} />
        <div className="slip-container">
          <PeopleList
            people={people}
            onUpdateTip={updateTip}
            onUpdateBill={updateBill}
            onReset={resetAll}
            resetSignal={resetSignal}
          />
        </div>
      </div>
      <MyFooter />
    </div>
  );
}

function NavBar({ people }) {
  return (
    <nav className="nav-bar">
      <MainTitle>Split & Tip</MainTitle>
      <Bill people={people}></Bill>
    </nav>
  );
}

function Bill({ people }) {
  const grandTotal = people.reduce(
    (sum, person) => sum + person.bill + person.tip,
    0
  );

  const billTotal = people.reduce((sum, person) => sum + person.bill, 0);
  const tipTotal = people.reduce((sum, person) => sum + person.tip, 0);

  return (
    <div>
      <div className="nav-bar-summary">
        <div>
          <p className="nav-bar-header">
            <span class="material-symbols-outlined">receipt_long</span>
            <span className="description">Bill Breakdown</span>
          </p>
          <CostDisplay price={billTotal.toFixed(2)}>Bill: </CostDisplay>
          <CostDisplay price={tipTotal.toFixed(2)}>Total Tip: </CostDisplay>
          <hr className="style-two"></hr>
          <CostDisplay price={grandTotal.toFixed(2)}>Bill & Tip:</CostDisplay>
        </div>
        <hr></hr>
        <div>
          <p className="nav-bar-header">
            <span class="material-symbols-outlined">groups</span>
            <span className="description">Per Person</span>
          </p>
          {people.map((p) => (
            <PersonSummary
              key={p.id}
              name={p.name}
              amount={(p.bill + p.tip).toFixed(2)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonSummary({ name, amount }) {
  return (
    <div className="person-summary">
      {name} - <span className="amount"> R {amount}</span>
    </div>
  );
}

function PeopleList({
  people,
  onUpdateTip,
  onUpdateBill,
  onReset,
  resetSignal,
}) {
  return (
    <div className="slip">
      <Title>People</Title>
      <button className="resest-btn" onClick={onReset}>
        <span class="material-symbols-outlined">restart_alt</span>RESET
      </button>
      {people.map((person) => (
        <Person
          key={person.id}
          person={person}
          onUpdateTip={onUpdateTip}
          onUpdateBill={onUpdateBill}
          resetSignal={resetSignal}
        />
      ))}
    </div>
  );
}

function Person({ person, onUpdateTip, onUpdateBill, resetSignal }) {
  const billAndTip = person.bill + person.tip;
  const bill = person.bill;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [resetSignal]);

  function handleItemInput(e) {
    const newValue = e.target.value;
    setInputValue(newValue);

    const items = newValue
      .split(/[ ,]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    const sum = items.reduce((a, b) => a + b, 0);
    onUpdateBill(person.id, sum);
  }

  return (
    <div className="person">
      <div className="paperclip-icon">
        <span class="material-symbols-outlined">attach_file</span>
      </div>
      <h3>{person.name}</h3>
      <CostDisplay price={billAndTip.toFixed(2)}>Bill & Tip:</CostDisplay>
      <ItemInput
        person={person}
        value={inputValue}
        onChange={handleItemInput}
      />
      <Tip
        tip={person.tip}
        onTipChange={(tip) => onUpdateTip(person.id, tip)}
        total={bill}
        resetSignal={resetSignal}
      />
    </div>
  );
}

function ItemInput({ person, value, onChange }) {
  return (
    <div className="person-items">
      <label>What did you have?</label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="100 50 burger, 20.50sd"
      />
      <small className="input-hint">
        Enter each item's cost, separated by commas or spaces. You can also
        include descriptive text for easier tracking.
      </small>
      <CostDisplay price={person.bill.toFixed(2)}>Total Bill: </CostDisplay>
    </div>
  );
}

function Tip({ tip, onTipChange, total, resetSignal }) {
  const [customTip, setCustomTip] = useState(0);
  const [isCustom, setIsCustom] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState(null);

  useEffect(() => {
    if (selectedPercentage !== null && !isCustom) {
      const newTip = (total * selectedPercentage) / 100;
      onTipChange(newTip);
    }
  }, [total, selectedPercentage, isCustom]);

  useEffect(() => {
    setCustomTip(0);
    setIsCustom(false);
    setSelectedPercentage(null);
  }, [resetSignal]);

  function handlePercentageChange(e) {
    const value = e.target.value;
    setSelectedPercentage(value);

    if (value === "custom") {
      setIsCustom(true);
      onTipChange(Number(customTip));
    } else {
      setIsCustom(false);
      const percentage = Number(value);
      setSelectedPercentage(percentage);
      onTipChange(Number((total * percentage) / 100));
    }
  }

  function handleCustomInput(e) {
    const value = Number(e.target.value);
    setCustomTip(value);
    onTipChange(value);
  }

  return (
    <div className="tip">
      <CostDisplay price={tip.toFixed(2)}>Total Tip: </CostDisplay>
      <label>Tip Selection</label>

      <select onChange={handlePercentageChange}>
        <option value={0}>0%</option>
        <option value={5}>5%</option>
        <option value={10}>10%</option>
        <option value={15}>15%</option>
        <option value="custom">Custom</option>
      </select>
      {isCustom && (
        <input
          type="text"
          value={customTip}
          onChange={handleCustomInput}
          placeholder="Enter custom tip"
        />
      )}
    </div>
  );
}

function MyFooter() {
  return (
    <footer className="footer">
      <div>Created by: Natia Natisvili</div>
      <div>
        <a
          href="https://github.com/Natia-bit/split-n-tip"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/github-mark.png" alt="GitHub" width="16" height="16" />
          Source Code
        </a>
      </div>
      <div>
        <a href="mailto:natia.natisvili@gmail.com">natia.natisvili@gmail.com</a>
      </div>
    </footer>
  );
}
