import React from 'react'
import PropTypes from 'prop-types'

export default class HistoryContext extends React.Component {

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
