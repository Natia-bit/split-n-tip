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
    <div className="slip">This is where the people will add their expences</div>
  );
}
