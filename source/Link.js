/**

This Component is based on the Link component from react-router:
https://github.com/ReactTraining/react-router/blob/21e4a1e95c4e9e8da534088b2d74157bf8f62ac4/modules/Link.js

The MIT License (MIT)

Copyright (c) 2015-present, Ryan Florence, Michael Jackson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */



import React from 'react'
import PropTypes from 'prop-types'

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export default class Link
  extends React.Component {

  handleClick(event) {
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
  }

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
}

Link.contextTypes = {
  history: PropTypes.object
}

Link.propTypes = {
  history: PropTypes.object,

  to: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  target: PropTypes.string
}