import React, { Component } from 'react';
import './App.css';

const Locales = {
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
  { key: 'id' },
  { key: 'name' },
  {
    key: 'phone',
    subcol: [
      { key: 'officephone' },
      { key: 'cellphone' },
    ]
  },
];

class App extends Component {
  state = {
    records: [],
    lan: 'zh',
  }
  toggleLan=()=>{
    this.setState({
        lan: this.state.lan === 'zh'? 'en' : 'zh'
    })
  }

  renderCols(coldef) {
    const locale = Locales[this.state.lan];
    return (
      <div className='cols'>
        { coldef.map(col => {
          if (col.subcol) {
            return (
              <div>
                <div className="col">
                  { locale[col.key] }
                </div>
                { this.renderCols(col.subcol) }
              </div>
            )
          } else {
            return (
              <div className='col'>{ locale[col.key] }</div>
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
        <button onClick={this.toggleLan}>中/EN</button>
      </div>
    )
  }
}

export default App;
