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
  cellDbclick = (index, record, colkey) => {
    this.setCol(index, 'edit', colkey)
  }
  inputBlur = (index, record, colkey) => { //todo, focus
    this.setCol(index, 'edit', null)
  }
  inputChange = (e, index, colkey) => { //todo, focus
    console.log(e.target);
    this.setCol(index, colkey, e.target && e.target.value)
  }
  setCol = (index, key, val) => {
    this.setState(state => {
      state.records.splice(index, 1, {
        ...state.records[index],
        [key]: val,
      })
      return {
        records: state.records,
      }
    })
  }

  renderCols(coldef, depth = 1) {
    const { records } = this.state;
    const locale = Locales[this.state.lan];
    const titleHeight = 30;
    return (
      <div className='cols'>
        { coldef.map(col => {
          if (col.subcol) {
            return (
              <div key={ col.key }>
                <div className="col-header" style={ { height: `${titleHeight}px` } }>{ locale[col.key] }</div>
                { this.renderCols(col.subcol, depth + 1) }
              </div>
            )
          } else {
            return ( //title and cells
              <div className='col' key={ col.key }>
                <div className="col-header" style={ { height: `${depth === DEPTH ? titleHeight : titleHeight * (DEPTH - depth + 1)}px` } }>{ locale[col.key] }</div>
                {
                  records && records.length > 0 && records.map((record, index) => (
                    record.edit === col.key ? //editing
                      <input
                        autoFocus
                        value={ record[col.key] }
                        onBlur={ () => this.inputBlur(index, record, col.key) }
                        onChange={ (e) => this.inputChange(e, index, col.key) }
                        key={record.id}
                      /> :
                      <div className='cell' onDoubleClick={ () => this.cellDbclick(index, record, col.key) } key={record.id}>
                        { record[col.key] }
                      </div>
                  ))
                }

              </div>
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
        <button onClick={ this.toggleLan }>中/EN</button>
      </div>
    )
  }
}

export default App;
