"use strict";


var React = require('react')


var HistoryContext = React.createClass({
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


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HistoryContext
