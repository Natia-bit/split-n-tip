import { useState } from "react";

export default function App() {
  return (
    <div className="App">
      <MainTitle>Split & Tip</MainTitle>
      <div className="slip-container">
        <Bill></Bill>
        <PeopleList></PeopleList>
      </div>
    </div>
  );
}

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

function PeopleList() {
  return (
    <div className="slip">
      <Title>People</Title>
      <Person name="Dude 1"></Person>
      <Person name="Dude 2"></Person>
    </div>
  );

  function Person({ name }) {
    const [personsTotal, setPersonsTotal] = useState(0);
    const [tip, setTip] = useState(0);

    const grandTotal = personsTotal + tip;

    const addItems = (e) => {
      const sumArray = e.target.value.split(",");
      const sum = sumArray.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
      if (sum) setPersonsTotal(sum);
    };

    function handleTipChange(e) {
      setTip(Number(e.target.value));
    }

    return (
      <div className="person">
        <h3>{name}</h3>
        <CostDisplay price={grandTotal.toFixed(2)}>Grand Total:</CostDisplay>
        <PersonsItems
          pTotal={personsTotal}
          onAddingItems={addItems}
        ></PersonsItems>
        <Tip
          tip={tip}
          onTipChange={handleTipChange}
          pTotal={personsTotal}
        ></Tip>
      </div>
    );
  }
}

function PersonsItems({ pTotal, onAddingItems }) {
  return (
    <div className="person-items">
      <label>What did you have?</label>
      <input type="text" onChange={onAddingItems}></input>
      <CostDisplay price={pTotal.toFixed(2)}>Total amount: </CostDisplay>
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
