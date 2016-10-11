import React from 'react'


export default React.createClass({
  displayName: 'HistoryContext',

  propTypes: {
    history: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired,
  },

  childContextTypes: {
    history: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      history: this.props.history
    }
  },

  render() {
    return this.props.children
  }
})
