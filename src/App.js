import React, { Component } from 'react';
import './App.css';
import { getRecords } from './ajax';

const Locales = {
  en: {
    _select: '[select]',
    id: 'ID',
    name: 'Name',
    location: 'Location',
    office: 'Office',
    phone: 'Phone', //
    cellphone: 'Cell',
    officephone: 'Office',
    personalcell: 'Personal',
    homecell: 'Home',
  },
  zh: {
    _select: '[选择]',
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
          // { key: 'personalcell' },
          // { key: 'homecell' },
        // ]
      },
    ]
  },
];
const DEPTH = 2; //todo
const actualCols = ['_select', 'id', 'name', 'location', 'office', 'officephone', 'cellphone']

// const Table = function({children}) {
//   return (
//     <div className='tablewrap'>
//       {children}
//     </div>
//   )
// }
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

  renderCols(coldef, depth=1) {
    const { records } = this.state;
    const locale = Locales[this.state.lan];
    const titleHeight =30;
    return (
      <div className='cols'>
        { coldef.map(col => {
          if (col.subcol) {
            return (
              <div key={ col.key }>
                <div className="col-header" style={{height:`${titleHeight}px`}}>{ locale[col.key] }</div>
                { this.renderCols(col.subcol, depth+1) }
              </div>
            )
          } else {
            return ( //title and cells
              <>
                <div className='col' key={ col.key }>
                  <div className="col-header" style={{height:`${depth===DEPTH? titleHeight : titleHeight*(DEPTH-depth+1)}px`}}>{ locale[col.key] }</div>
                  {
                    records && records.length > 0 && records.map(record => (
                      <div className='cell'>
                        { record[col.key] }
                      </div>
                    ))
                  }

                </div>
              </>
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
    return (
      <div className='bookwrap'>
        { this.renderCols(colDef) }
        <button onClick={ this.toggleLan }>中/EN</button>
      </div>
    )
  }
}

export default App;
