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

function Bill() {
  return (
    <div className="slip">
      <Title>Bill</Title>
      <label>Bill amount</label>
      <input type="text"></input>

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
    return (
      <div className="person">
        <h3>{name}</h3>
        <p className="person-bill-output">
          Grand Total: <span>XX</span>
        </p>
        <PersonsItems></PersonsItems>
        <Tip></Tip>
      </div>
    );
  }
}

function PersonsItems() {
  return (
    <div className="person-items">
      <label>What did you have?</label>
      <input type="text"></input>

      <p className="person-item">
        Total: <span>XX</span>
      </p>
    </div>
  );
}

function Tip() {
  return (
    <div className="tip">
      <label>Tip Selection</label>
      <select value="tip" default={0}>
        <option value={0}> 0% </option>
        <option value={5}> 5% </option>
        <option value={10}> 10% </option>
        <option value={20}>Custom </option>
      </select>
    </div>
  );
}
