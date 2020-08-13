import React, { Component } from 'react';
import './App.css';
import { getRecords } from './ajax';

const Locales = {
  en: {
    id: 'ID',
    name: 'Name',
    office: 'Office',
    phone: 'Phone', //
    cellphone: 'Cell',
    officephone: 'Office',
    personalcell: 'Personal',
    homecell: 'Home',
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
  { key: '_select' }, //
  { key: 'id' },
  { key: 'name' },
  { key: 'location' },
  { key: 'office' },
  {
    key: 'phone',
    subcol: [
      { key: 'officephone' },
      {
        key: 'cellphone',
        // subcol: [
        //   { key: 'personalcell' },
        //   { key: 'homecell' },
        // ]
      },
    ]
  },
];
const actualCols = ['_select', 'id', 'name', 'location', 'office', 'officephone', 'cellphone']

class App extends Component {
  state = {
    records: [],
    lan: 'en',
  }
  componentDidMount() {
    getRecords().then(res => {
      console.log(res);
      this.setState({
        records: res,
      })
    })
  }
  toggleLan = () => {
    this.setState({
      lan: this.state.lan === 'zh' ? 'en' : 'zh'
    })
  }

  renderColTitles(coldef) {
    const locale = Locales[this.state.lan];
    return (
      <div className='cols'>
        { coldef.map(col => {
          if (col.subcol) {
            return (
              <div key={ col.key }>
                <div className="col">
                  { locale[col.key] }
                </div>
                { this.renderColTitles(col.subcol) }
              </div>
            )
          } else {
            return (
              <div className='col' key={ col.key }>{ locale[col.key] }</div>
            )
          }
        }) }
      </div>
    )
  }
  renderRows() {
    const { records } = this.state;
    return (
      records && records.length > 0 && records.map(record => (
        <div className='row'>
          { actualCols.map(col => <div className='col'>{ record[col] }</div>) }
        </div>
      ))
    )
  }
  render() {
    const { records } = this.state;
    return (
      <div className='bookwrap'>
        { this.renderColTitles(colDef) }
        { this.renderRows() }
        <button onClick={ this.toggleLan }>中/EN</button>
      </div>
    )
  }
}

export default App;
