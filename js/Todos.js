var $ = require('jquery');
var I = require('immutable');
var B = require('react-bootstrap');
var React = require('react');
var moment = require('moment');
var Actions = require('./Actions');
var Store = require('./Store');
var Input = B.Input,
  Table = B.Table,
  Button = B.Button;

var Todo = React.createClass({
  propTypes: {
    iTodo: React.PropTypes.instanceOf(I.Map)
  },

  handleUpdate() {
    Actions.todosUpdate({
      _id: this.props.iTodo.get('_id'),
      due_date: this.refs.due_date.getValue(),
      name: this.refs.name.getValue(),
      description: this.refs.description.getValue(),
      finished: this.refs.finished.getChecked()
    });
  },

  handleDelete() {
    var id = this.props.iTodo.get('_id');
    Actions.todosRemove(id);
  },

  render(){
    var iTodo = this.props.iTodo;
    // JSON.parse('true') === true
    // JSON.parse(true) === true
    var finished = iTodo.get('finished');
    return (
      <tr className='todo'>
        <td>
          <Input defaultValue={iTodo.get('name')} ref='name' type='text' />
        </td>
        <td>
          <Input defaultValue={iTodo.get('description')} ref='description' type='text' />
        </td>
        <td>
          <Input defaultValue={moment(iTodo.get('due_date')).format('YYYY-MM-DD')} ref='due_date' type='date' />
        </td>
        <td>
          <Button onClick={this.handleUpdate} bsStyle='primary'>Update</Button>
          <Button onClick={this.handleDelete} bsStyle='secondary'>Remove</Button>
        </td>
        <td>
          <Input checked={finished === 'true' || finished === true} type='checkbox' label='Finish' ref='finished' onClick={this.handleUpdate}></Input>
        </td>
      </tr>
    );
  }
});

module.exports = React.createClass({
  propTypes: {
    iStore: React.PropTypes.instanceOf(I.Map).isRequired
  },

  getInitialState() {
    return {
      iStore: Store.getStore()
    };
  },

  handleCreate(){
    Actions.todosCreate({
      due_date: this.refs.due_date.getValue(),
      name: this.refs.name.getValue(),
      description: this.refs.description.getValue()
    });
    $(this.refs.due_date.getInputDOMNode()).val('');
    $(this.refs.name.getInputDOMNode()).val('');
    $(this.refs.description.getInputDOMNode()).val('');
  },

  componentWillMount(){
    Actions.todosIndex();
  },

  componentDidMount() {
    Store.addChangeListener(this._onChange);
    //window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState({
      iStore: Store.getStore()
    });
  },

  render(){
    var todos = this.state.iStore.get('todos').map((iTodo, id) => {
      return (<Todo key={id} iTodo={iTodo} />);
    });
    return (
      <Table striped bordered condensed hover className='todos'>
        <thead>
        <tr>
          <th className='col-md-2'>Name</th>
          <th className='col-md-6'>Description</th>
          <th className='col-md-1'>Due Date</th>
          <th className='col-md-2'></th>
          <th className='col-md-1'>Finished</th>
        </tr>
        </thead>
        <tbody>
          {todos}
          <tr className='todo'>
            <td><Input ref='name' type='text' /></td>
            <td><Input ref='description' type='text' /></td>
            <td><Input ref='due_date' type='date' /></td>
            <td><Button onClick={this.handleCreate} bsStyle='primary'>添加</Button></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    )
  }
});
