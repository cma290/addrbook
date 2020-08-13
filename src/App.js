import React, { Component } from 'react';
import './App.css';
import { getRecords } from './ajax';

class App extends Component {
  state = {
    records: [],
    lan: 'en',
    sortAscend: false,
    selectAll: false,
    deleted: [],
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
    if (colkey === 'cellphone' || (!record.id && colkey !== 'id')) { //cellphone or new added row
      this.setKey(index, 'edit', colkey)
    }
  }
  inputBlur = (index, record, colkey) => {
    this.setKey(index, 'edit', null)
  }
  inputChange = (e, index, colkey) => {
    // console.log(e.target);
    this.setKey(index, colkey, e.target && e.target.value)
    this.setKey(index, 'flag', 'dirty') //todo merge
  }
  update = () => {
    const { records, deleted } = this.state;
    let arr = records.filter(rec => rec.flag === 'dirty' && rec.id).map(rec => rec.id);
    let del = deleted.map(rec => rec.id);
    let added = records.filter(rec => !rec.id);
    console.log(arr, del, added);
    alert(`updated id: ${arr} \n deleted id: ${del} \n added: ${added.length} new record`)
  }
  headerClick = (key) => {
    if (key === '_select') {
      this.setKeyAll(key, !this.state.selectAll);
      this.setState({
        selectAll: !this.state.selectAll,
      })
    } else {
      this.sort(key);
    }
  }
  sort = (key) => {
    // console.log('sort key',key);
    this.setState(state => {
      state.records.sort((a, b) => {
        if (a[key] < b[key]) { // return 1 means swap
          return state.sortAscend ? 1 : -1;
        }
        if (a[key] > b[key]) {
          return state.sortAscend ? -1 : 1;
        }
        return 0
      });
      return {
        records: state.records,
        sortAscend: !state.sortAscend,
      }
    })
  }
  onDelete = () => {
    this.setState(state => {
      return {
        records: state.records.filter(rec => !rec._select),
        deleted: state.records.filter(rec => rec._select && rec.id),
      }
    })
  }
  add = () => {
    this.setState(state => {
      return {
        records: [...state.records, {
          name: '',
          location: '',
          office: '',
          cellphone: '',
          officephone: '',
        }],

      }
    })
  }

  // statehelper
  setKey = (index, key, val) => {
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
  setKeyAll = (key, val) => {
    this.setState(state => {
      return {
        records: state.records.map(rec => ({
          ...rec,
          [key]: val,
        })),
      }
    })
  }

  // render
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
                  className="col-header header-sort"
                  style={ { height: `${depth === DEPTH ? titleHeight : titleHeight * (DEPTH - depth + 1)}px` } }
                  onClick={ () => this.headerClick(col.key) }
                >{ locale[col.key] }</div>
                { this.renderColCells(records, col.key) }
              </div>
            )
          }
        }) }
      </div>
    )
  }
  renderColCells(records, key) {
    return (
      records && records.length > 0 && records.map((record, index) => {
        if (key === '_select') {
          return (
            <div className='cell' onClick={ () => this.setKey(index, key, !record[key]) } key={ record.id }>
              { record[key] ? '√' : '' }
            </div>
          )
        }
        if (record.edit === key) {
          return (
            <input
              autoFocus
              value={ record[key] }
              onBlur={ () => this.inputBlur(index, record, key) }
              onChange={ (e) => this.inputChange(e, index, key) }
              key={ record.id }
            />
          )
        }
        return (
          <div className='cell'
            onDoubleClick={ () => this.cellDbclick(index, record, key) }
            key={ record.id }
          > { record[key] }</div>
        )
      })
    )
  }
  render() {
    const locale = Locales[this.state.lan];
    return (
      <div className='bookwrap'>
        <button onClick={ this.toggleLan }>中/EN</button>
        { this.renderCols(colDef) }
        <div className='btns'>
          <button onClick={ this.onDelete }>{ locale.delete }</button>
          <div>
            <button onClick={ this.update }>{ locale.update }</button>
            <button onClick={ this.add }>{ locale.add }</button>
          </div>
        </div>
      </div>
    )
  }
}

const Locales = {
  en: {
    _select: '[Sel]',
    id: 'ID',
    name: 'Name',
    location: 'Location',
    office: 'Office',
    phone: 'Phone',
    cellphone: 'Cell',
    officephone: 'Office',
    personalcell: 'Personal',
    homecell: 'Home',

    delete: 'Delete',
    update: 'Update',
    add: 'Add',
  },
  zh: {
    _select: '[全选]',
    id: '编号',
    name: '姓名',
    location: '城市',
    office: '办公室',
    phone: '电话',
    cellphone: '手机',
    officephone: '办公',

    delete: '删除',
    update: '提交修改',
    add: '添加',
  }
}

const DEPTH = 2; // col title nest depth
const colDef = [
  { key: '_select' },
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

export default App;
