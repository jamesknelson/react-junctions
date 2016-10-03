"use strict";


var React = require('react')
var deepEqual = require('deep-equal')
var createConverter = require('junctions').createConverter


function createSearch(query) {
  var keys = Object.keys(query)

  if (keys.length === 0) {
    return ''
  }

  var parts = []
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i]
    var value = query[key]
    parts.push(value === '' ? key : key+'='+encodeURIComponent(value))
  }

  return '?' + parts.join('&')
}


function locationsEqual(x, y) {
  return (
    x.pathname == y.pathname &&
    x.search == y.search &&
    deepEqual((x.state && x.state.$$junctions) || {}, (y.state && y.state.$$junctions) || {})
  )
}


function createRoute(component, junctionSet, path) {
  function getBaseLocation(routerState) {
    var location = routerState.location

    var i, key, len
    var baseQuery = {}
    var locationKeys = Object.keys(location.query || {})

    for (i = 0; i < locationKeys.length; i++) {
      key = locationKeys[i]
      baseQuery[key] = location.query[key]
    }

    var queryKeys = junctionSet.$$junctionSetMeta.queryKeys
    for (i = 0, len = queryKeys.length; i < len; i++) {
      key = queryKeys[i]
      delete baseQuery[key]
    }

    var nonJunctionsState = {}
    var stateKeys = Object.keys(location.state || {})
    for (i = 0, len = stateKeys.length; i < len; i++) {
      key = stateKeys[i]
      if (key !== '$$junctions') {
        nonJunctionsState[key] = location.state[key]
      }
    }
    
    return {
      pathname: location.pathname.replace('/'+routerState.params.splat, '') || '/',
      search: createSearch(baseQuery),
      state: nonJunctionsState,
      hash: location.hash,
      key: location.key,
    }
  }

  var converter = createConverter(junctionSet)

  var JunctionMount = React.createClass({
    contextTypes: {
      router: React.PropTypes.object
    },

    childContextTypes: {
      history: React.PropTypes.object
    },

    getChildContext: function() {
      return {
        history: this.context.router
      }
    },

    render: function render() {
      var baseLocation = getBaseLocation(this.props)
        
      return (
        React.createElement(component, {
          routes: converter.getRouteSetFromLocation(this.props.location, baseLocation),
          locate: routeSet => converter.getLocationFromRouteSet(routeSet, baseLocation),
        })
      )
    }
  })

  function handleChange(_, nextState, replace) {
    var baseLocation = getBaseLocation(nextState)
    var currentRouteSet = converter.getRouteSetFromLocation(nextState.location, baseLocation)

    if (!currentRouteSet) {
      console.error('react-junctions: Unknown location received')
      return
    }

    var canonicalLocation = converter.getLocationFromRouteSet(currentRouteSet, baseLocation)
    if (!locationsEqual(canonicalLocation, nextState.location)) {
      replace(canonicalLocation)
    }
  }

  return {
    component: JunctionMount,
    onEnter: handleChange.bind(null, {}),
    onChange: handleChange,
    path: (path === '/' || path === '') ? '**' : `${path}(/**)`
  }
}


var Mount = React.createClass({
  displayName: 'Mount',

  propTypes: {
    path: React.PropTypes.string.isRequired,
    component: React.PropTypes.func.isRequired,
  },

  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var component = element.props.component
      return createRoute(component, component.junctionSet, element.props.path)
    },
  },

  render: function render() {
    throw new Error('<Mount> elements are for router configuration and should not be rendered')
  },
})


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoute = createRoute
exports.Mount = Mount
