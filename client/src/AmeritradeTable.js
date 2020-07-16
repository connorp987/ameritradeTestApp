import React, { Component, PureComponent } from 'react';
import './AmeritradeTable.css';
import { Table, Button, Divider, Space, Tag, Input, Statistic, Typography, Row, Col, Select, Drawer, Menu, Dropdown } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


import timestamp, { Minute } from 'unix-timestamp'

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;




class CustomizedAxisTick extends PureComponent {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
      </g>
    );
  }
}

class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/5br7g9d6/';

  state = {
    bearer: '',
    data: [],
    searchStock: 'XOM',
    visible: false,
    periodType: 'day',
    period: 2,
    frequencyType: 'minute',
    frequency: 30, 
    afterHours: false
  }


  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (value) => {
    this.setState({ searchStock: value })
  }

  onBlur() {
    //console.log('blur');
  }

  onFocus() {
    //console.log('focus');
  }

  onSearch(value) {
    //console.log('search:', value);
  }

  onPeriodType = (value) => {
    this.setState({ periodType: value })
  }

  onPeriod = (value) => {
    this.setState({ period: value })
  }

  onFrequencyType = (value) => {
    this.setState({ frequencyType: value })
  }

  onFrequency = (value) => {
    this.setState({ frequency: value })
  }

  onAfterHours = (value) => {
    this.setState({ afterHours: value })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchStock !== this.state.searchStock || prevState.periodType !== this.state.periodType 
      || prevState.period !== this.state.period || prevState.frequencyType !== this.state.frequencyType || prevState.frequency !== this.state.frequency
      || prevState.afterHours !== this.state.afterHours) {

      if(this.state.frequencyType !== 'minute') {
        this.setState({frequency: 1})
      }

      fetch('http://localhost:9000/testAPI/accessToken')
        .then(res => res.text())
        .then(json => {
          this.setState({ bearer: json })

          let fetchString = 'https://api.tdameritrade.com/v1/marketdata/' + this.state.searchStock + '/pricehistory?apikey=FAYWOIT6KXS9FKGYLVJBDL86XLEHNLRS&periodType=' + this.state.periodType +'&period=' + this.state.period +'&frequencyType=' + this.state.frequencyType +'&frequency=' + this.state.frequency +'&needExtendedHoursData=' + this.state.afterHours + ''
          return fetch(fetchString, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + this.state.bearer
            }
          })
        })
        .then(res => res.json())
        .then(json => {
          //console.log(json)
          if (json.candles != undefined) {
            json.candles.map(can => {
              let temp = parseInt(((can.datetime + "").slice(0, 10)))
              let actualTime = (timestamp.toDate(temp) + "").slice(0, 21)
              can.datetime = actualTime
              //console.log(can.datetime)
            })
            this.setState({ data: json.candles })
          }
        })
    }
  }



  render() {
    let conditional;
    let frequencyT;
    let frequency;
    if (this.state.periodType === 'day') {
      conditional = (
        <Select onChange={this.onPeriod} style={{ marginLeft: '8px' }} defaultValue={this.state.period}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
        </Select>)
    } else if (this.state.periodType === 'month') {
      conditional = (
        <Select onChange={this.onPeriod} style={{ marginLeft: '8px' }} defaultValue={this.state.period}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={6}>6</Option>
        </Select>)
    } else if (this.state.periodType === 'year') {
      conditional = (
        <Select onChange={this.onPeriod} style={{ marginLeft: '8px' }} defaultValue={this.state.period}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={15}>15</Option>
          <Option value={20}>20</Option>
        </Select>)
    } else if (this.state.periodType === 'ytd') {
      conditional = (
        <Select onChange={this.onPeriod} style={{ marginLeft: '8px' }} defaultValue={this.state.period}>
          <Option value={1}>1</Option>
        </Select>)
    }

    if (this.state.periodType === 'day') {
      frequencyT = (
        <Select onChange={this.onFrequencyType} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.frequencyType}>
          <Option value="minute">Minute</Option>
        </Select>)
    } else if (this.state.periodType === 'month' || this.state.periodType === 'ytd') {
      frequencyT = (
        <Select onChange={this.onFrequencyType} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.frequencyType}>
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
        </Select>)
    } else if (this.state.periodType === 'year') {
      frequencyT = (
        <Select onChange={this.onFrequencyType} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.frequencyType}>
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
        </Select>)
    }

    if (this.state.frequencyType === 'minute') {
      frequency = (
        <Select onChange={this.onFrequency} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.frequency}>
          <Option value={1}>1</Option>
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={15}>15</Option>
          <Option value={30}>30</Option>
        </Select>
      )
    } else {
      frequency = (
        <Select onChange={this.onFrequency} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.frequency}>
          <Option value={1}>1</Option>
        </Select>
      )
    }

    return (
      <div>
        <div style={{ margin: 'auto' }}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select your Stock"
            optionFilterProp="children"
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onSearch={this.onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              this.props.stockList.map(data => {
                //console.log(this.props.tempData)
                return (<Option key={data} value={data}>{data}</Option>)
              })
            }


          </Select>
          <Text> or </Text>
          <Search
            placeholder="Search a Stock Symbol"
            onSearch={value => this.setState({ searchStock: value })}
            style={{ width: 200, }}
          />
        </div>
        <Button style={{ marginLeft: '70%' }} type="primary" onClick={this.showDrawer}>
          Filter
        </Button>
        <Drawer
          title="Graph Filters"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Input.Group compact>
            <Text style={{ marginTop: '5px' }}>Period Type</Text>
            <Select onChange={this.onPeriodType} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.periodType}>
              <Option value="day">Day</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
              <Option value="ytd">Year to Date</Option>
            </Select>
            <Divider />
            <Text style={{ marginTop: '5px' }}>Period</Text>
            {conditional}
            <Divider />
            <Text style={{ marginTop: '5px' }}>Frequency Type</Text>
            {frequencyT}
            <Divider />
            <Text style={{ marginTop: '5px' }}>Frequency</Text>
            {frequency}
            <Divider />
            <Text style={{ marginTop: '5px' }}>After Hour Stocks</Text>
            <Select onChange={this.onAfterHours} style={{ marginLeft: '8px', width: '100px' }} defaultValue={this.state.afterHours}>
              <Option value={true}>True</Option>
              <Option value={false}>False</Option>
            </Select>

          </Input.Group>
        </Drawer>

        <LineChart
          style={{ margin: 'auto' }}
          width={1100}
          height={500}
          data={this.state.data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="high" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="low" stroke="#82ca9d" />

        </LineChart>
      </div>
    );
  }
}

export default class AmeritradeTable extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    listOfStocks: []
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  componentDidUpdate() {
    //console.log(this.props.data)
    let tempD = []
    this.props.data.map(data => {
      tempD.push(data.symbol)
    })
    if (!this.arraysEqual(tempD, this.state.listOfStocks)) {
      this.setState({ listOfStocks: tempD })
    }

  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
      searchText: ''
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });


  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Stock Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: filteredInfo.symbol || null,
        onFilter: (value, record) => record.symbol.includes(value),
        sorter: (a, b) => a.symbol.length - b.symbol.length,
        sortOrder: sortedInfo.columnKey === 'symbol' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('symbol'),

      },
      {
        title: 'Market Value',
        dataIndex: 'marketValue',
        key: 'marketValue',
        sorter: (a, b) => a.marketValue - b.marketValue,
        sortOrder: sortedInfo.columnKey === 'marketValue' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Current Day Profit / Loss',
        dataIndex: 'currentDayProfitLossPercentage',
        key: 'currentDayProfitLossPercentage',
        render: currentDayProfitLossPercentage => (
          <>
            <div className="site-statistic-demo-card">
              <Row gutter={2}>
                {(Math.sign(currentDayProfitLossPercentage) === 1) ? (
                  <Col span={15}>

                    <Statistic
                      title="Active"
                      value={currentDayProfitLossPercentage}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<ArrowUpOutlined />}
                      suffix="%"
                    />

                  </Col>
                ) : (
                    <Col span={15}>

                      <Statistic
                        title="Idle"
                        value={currentDayProfitLossPercentage}
                        precision={2}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<ArrowDownOutlined />}
                        suffix="%"
                      />

                    </Col>
                  )}
              </Row>
            </div>
          </>
        ),
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <>
            {tags.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: 'Quantity',
        dataIndex: 'longQuantity',
        key: 'longQuantity',
        filters: [
          { text: 'London', value: 'London' },
          { text: 'New York', value: 'New York' },
        ],
        filteredValue: filteredInfo.longQuantity || null,
        onFilter: (value, record) => record.longQuantity.includes(value),
        sorter: (a, b) => a.longQuantity - b.longQuantity,
        sortOrder: sortedInfo.columnKey === 'longQuantity' && sortedInfo.order,
        ellipsis: true,
      },
    ];
    return (
      <div style={{ width: '70%', margin: 'auto', marginTop: '2%' }}>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={this.setAgeSort}>Sort age</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table columns={columns} dataSource={this.props.data} onChange={this.handleChange} />


        <Example stockList={this.state.listOfStocks} />
      </div>
    );
  }
}