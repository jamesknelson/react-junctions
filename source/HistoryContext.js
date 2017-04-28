import React from 'react'
import PropTypes from 'prop-types'

export default class HistoryContext extends React.Component {
  constructor() {
    this.getChildContext = this.getChildContext.bind(this)
  }

  getChildContext() {
    return {
      history: this.props.history
    }
  }

  render() {
    return this.props.children
  }
}

HistoryContext.propTypes = {
  history: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

HistoryContext.childContextTypes = {
  history: PropTypes.object
}
