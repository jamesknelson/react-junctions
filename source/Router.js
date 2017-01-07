import React, { Component, PropTypes } from 'react'
import { createConverter, locationsEqual } from 'junctions'
import HistoryContext from './HistoryContext'


export default React.createClass({
  displayName: 'Router',

  propTypes: {
    baseLocation: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      state: PropTypes.object,
    }),
    history: PropTypes.object.isRequired,
    junction: PropTypes.object.isRequired,
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Component), PropTypes.element]).isRequired,
  },

  childContextTypes: {
    history: PropTypes.object,
  },

  getChildContext() {
    return {
      history: this.props.history,
    }
  },

  componentWillMount() {
    this.converter = createConverter(this.props.junction, this.props.baseLocation)
    this.handleLocationChange(this.props.history.location)
    this.unlisten = this.props.history.listen(this.handleLocationChange)
  },

  componentWillReceiveProps(nextProps) {
    const prevBase = this.props.baseLocation
    const nextBase = nextProps.baseLocation

    const baseChanged =
      (!prevBase && nextBase) ||
      (nextBase && !prevBase) ||
      (nextBase && prevBase &&
          nextBase.pathname != prevBase.pathname &&
          nextBase.search != prevBase.search &&
          nextBase.state != prevBase.state
      )

    // Don't recreate the converter unless we need to, as it can be an expensive operation,
    // and is only needed when the application loads new code
    if (baseChanged || nextProps.junction != this.props.junction) {
      this.converter = createConverter(nextProps.junction, nextProps.baseLocation)
    }
  },

  handleLocationChange(location) {
    const route = this.converter.route(location)
    const canonicalLocation = route && this.converter.locate(route)

    if (route && !locationsEqual(location, canonicalLocation)) {
      this.props.history.replace(canonicalLocation)
    }

    this.setState({ route })
  },

  render() {
    const renderProps = {
      route: this.state.route,
      locate: this.converter.locate,
    }

    let content
    if (this.props.render instanceof Component) {
      content = React.createElement(this.props.render, renderProps)
    }
    else if (typeof this.props.render == 'function') {
      content = this.props.render(renderProps)
    }
    else {
      content = React.cloneElement(this.props.render, renderProps)
    }

    return React.createElement(HistoryContext, {history: this.props.history}, content)
  },
})
