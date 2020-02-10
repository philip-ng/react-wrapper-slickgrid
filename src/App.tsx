import React from 'react';
//import logo from './logo.svg';
import './App.css';
import './MyGrid'
import MyGrid, {MyGridRowData} from './MyGrid';

const columns : Slick.Column<DataItem>[] = [
  {id: "sel", name: "#", field: "num", behavior: "select", cssClass: "cell-selection", width: 60, resizable: false, selectable: false },
  {id: "title", name: "Title", field: "title", width: 120, minWidth: 120, cssClass: "cell-title"},
  {id: "duration", name: "Duration", field: "duration"},
  {id: "%", name: "% Complete", field: "percentComplete", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar},
  {id: "start", name: "Start", field: "start", minWidth: 60},
  {id: "finish", name: "Finish", field: "finish", minWidth: 60},
  {id: "effort-driven", name: "Effort Driven", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven", formatter: (row, cell, value, columnDef, dataContext) => {
      return value ? "<img src='images/tick.png'>" : "";
    }}
];

class DataItem implements MyGridRowData {
  num : number;
  id : string;
  percentComplete : number;
  effortDriven : boolean;
  start : string;
  finish : string;
  title : string;
  duration : string;
  constructor(i: number) {
    this.num = i;
    this.id = "id_" + i;
    this.percentComplete = Math.round(Math.random() * 100);
    this.effortDriven = (i % 5 === 0);
    this.start = "01/01/2009";
    this.finish = "01/05/2009";
    this.title = "Task " + i;
    this.duration = "5 days";
  }
  getUniqKey() : string {return this.id;}
}

const options = {
  rowHeight: 30,
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true
};

const App = () => {
  const gridRef : React.RefObject<MyGrid<DataItem>> = React.createRef();
  let data : DataItem[] = [];
  for (var i = 0; i < 500000; i++) {
    data[i] = new DataItem(i);
  }
  setInterval(() => {
    const n : number = Math.floor(Math.random() * 20);
    let change = new DataItem(n);
    change.effortDriven = Math.floor(Math.random() * 20) < 10;
    gridRef.current?.setItem(change);
  }, 50);
  return (
    <div className="App">
      <MyGrid<DataItem> ref={gridRef} style='width:100%;height:600px;' options={options} columns={columns} data={data} />
    </div>
  );
}

/*
const AppOld = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <MyGrid<DataItem> my_counter={1} my_callback={callback} />
    </div>
  );
}
*/
export default App;
