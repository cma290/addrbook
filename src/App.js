import React, { Component } from 'react';
import './App.css';
import { getRecords } from './ajax';

class App extends Component {
  state = {
    records: [],
    lan: 'en',
    sortAscend: false,
  }
  componentDidMount() {
    getRecords().then(res => {
      // console.log(res);
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
  inputBlur = (index, record, colkey) => {
    this.setCol(index, 'edit', null)
  }
  inputChange = (e, index, colkey) => {
    // console.log(e.target);
    this.setCol(index, colkey, e.target && e.target.value)
    this.setCol(index, 'flag', 'dirty') //todo merge
  }
  update = () => {
    let arr = this.state.records.filter(rec => rec.flag === 'dirty').map(rec => rec.id);
    if (arr && arr.length) {
      alert('modified: ' + arr);
    }
  }
  sort = (key) => {
    // console.log('sort key',key);
    this.setState(state => {
      state.records.sort((a, b) => {
        if (a[key] < b[key]) { // return 1 means swap
          return state.sortAscend? 1: -1;
        }
        if (a[key] > b[key]) {
          return state.sortAscend? -1: 1;
        }
        return 0
      });
      console.log('sorted records', state.records);
      return {
        records: state.records,
        sortAscend: !state.sortAscend,
      }
    })
  }
  setCol = (index, key, val) => { // {}
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
            return (
              <div className='col' key={ col.key }>
                <div // header with sort
                  className="col-header"
                  style={ { height: `${depth === DEPTH ? titleHeight : titleHeight * (DEPTH - depth + 1)}px` } }
                  onClick={ () => this.sort(col.key) }
                >{ locale[col.key] }</div>
                {
                  // col cells
                  records && records.length > 0 && records.map((record, index) => (
                    record.edit === col.key ? //editing
                      <input
                        autoFocus
                        value={ record[col.key] }
                        onBlur={ () => this.inputBlur(index, record, col.key) }
                        onChange={ (e) => this.inputChange(e, index, col.key) }
                        key={ record.id }
                      /> :
                      <div className='cell' onDoubleClick={ () => this.cellDbclick(index, record, col.key) } key={ record.id }>
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
    const locale = Locales[this.state.lan];
    return (
      <div className='bookwrap'>
        { this.renderCols(colDef) }
        <button onClick={ this.toggleLan }>中/EN</button>
        <button onClick={ this.onDelete }>{ locale.delete }</button>
        <button onClick={ this.update }>{ locale.update }</button>
        <button onClick={ this.add }>{ locale.add }</button>
      </div>
    )
  }
}

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

    delete: 'Delete',
    update: 'Update',
    add: 'Add',
  },
  zh: {
    _select: '[选择]',
    id: '编号',
    name: '姓名',
    office: '办公室',
    phone: '电话', //
    cellphone: '手机',
    officephone: '办公',

    delete: '删除',
    update: '提交修改',
    add: '添加',
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
const DEPTH = 2; //

// const Table = function({children}) {
//   return (
//     <div className='tablewrap'>
//       {children}
//     </div>
//   )
// }

export default App;
