import React, { Component } from 'react';
import './App.css';

const locale = {
  en: {
    id: 'ID',
    name: 'Name',
    office: 'Office',
    phone: 'Phone', //
    cellphone: 'Cell',
    officephone: 'Office',
  },
  zh: {
    id: '编号',
    name: '姓名',
    office: '办公室',
    phone: '电话', //
    cellphone: '手机',
    officephone: '办公',
  }
}

const colDef = [
  { title: 'id' },
  { title: 'name' },
  {
    title: 'phone',
    subcol: [
      { title: 'office' },
      { title: 'cell' },
    ]
  },
];

class App extends Component {
  state = {
    records: [],
    lan: 'zh',
  }
  inc(v) {
    this.setState({
      target: this.state.target + v
    })
  }

  renderCols(coldef) {
    return (
      <div className='cols'>
        { coldef.map(col => {
          if (col.subcol) {
            return (
              <div>
                <div className="col">
                  { col.title }
                </div>
                { this.renderCols(col.subcol) }
              </div>
            )
          } else {
            return (
              <div className='col'>{ col.title }</div>
            )
          }
        }) }
      </div>
    )
  }
  render() {
    return (
      <div className='bookwrap'>
        { this.renderCols(colDef) }
      </div>
    )
  }
}

export default App;
