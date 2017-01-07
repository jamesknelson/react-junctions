import React from 'react'


function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}


export default React.createClass({
  displayName: 'Link',

  contextTypes: {
    history: React.PropTypes.object,
  },

  propTypes: {
    history: React.PropTypes.object,

    to: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func,
    target: React.PropTypes.string
  },

  handleClick: function(event) {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (event.defaultPrevented) {
      return
    }

    var history = this.props.history || this.context.history

    if (!history) {
      throw new Error('<Link> requires a history object to be passed in, either via props or via context.')
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return
    }

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    if (this.props.target) {
      return
    }

    event.preventDefault()

    history.push(this.props.to)
  },

  render() {
    var props = {}
    var keys = Object.keys(this.props)
    var i, key

    for (i = 0; i < keys.length; i++) {
      key = keys[i]
      if (key !== 'history' && key !== 'to') {
        props[key] = this.props[key]
      }
    }

    props.onClick = this.handleClick
    props.href = this.props.to.pathname + (this.props.to.search || '')

    return React.createElement('a', props)
  }
})
