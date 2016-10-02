var React = require('react')
var deepEqual = require('deep-equal')
var createConverter = require('junctions').createConverter


function locationsEqual(x, y) {
  return (
    x.pathname == y.pathname &&
    x.search == y.search &&
    deepEqual((x.state && x.state.junctions) || {}, (y.state && y.state.junctions) || {})
  )
}


function createRoute(component, junctionSet, path) {
  const route = {}

  if (path) {
    route.path = (path === '/' || path === '') ? '**' : `${path}(/**)`
  }
  else {
    route.childRoutes = [
      { path: '**' }
    ]
  }

  function getBaseLocation(routerState) {
    // TODO: memoize by object equality with memory size of 1

    // const baseRoutes = routerState.routes.slice(0, routerState.routes.indexOf(rootRoute))
    
    // TODO:
    // - calculate base path (path part of URL for baseRoutes)
    // - calculate base query (query parts which don't match our format)
    // - return
    const location = routerState.location

    const nonJunctionsState = location.state || {}
    delete nonJunctionsState.junctions

    return {
      pathname: '/',
      search: location.search,
      hash: location.hash,
      key: location.key,
      state: nonJunctionsState,
    }
  }

  console.log(junctionSet)

  const converter = createConverter(junctionSet)

  const JunctionMount = React.createClass({
    render: function render() {
      const baseLocation = getBaseLocation(this.props)
        
      return (
        React.createElement(component, {
          routes: converter.getRouteSetFromLocation(baseLocation, this.props.location),
          locate: routeSet => converter.getLocationFromRouteSet(baseLocation, routeSet),
        })
      )
    }
  })

  function handleChange(_, nextState, replace) {
    const baseLocation = getBaseLocation(nextState)
    const currentRouteSet = converter.getRouteSetFromLocation(baseLocation, nextState.location)
    const canonicalLocation = converter.getLocationFromRouteSet(baseLocation, currentRouteSet)

    if (!locationsEqual(canonicalLocation, nextState.location)) {
      replace(canonicalLocation)
    }
  }

  route.component = JunctionMount
  route.onEnter = handleChange.bind(null, {})
  route.onChange = handleChange

  return route
}


module.exports.createRoute = createRoute


module.exports.Mount = React.createClass({
  displayName: 'Mount',

  propTypes: {
    path: React.PropTypes.string.isRequired,
    component: React.PropTypes.func.isRequired,
  },

  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element) {
      const component = element.props.component
      return createRoute(component, component.junctionSet, element.props.path)
    },
  },

  render: function render() {
    throw new Error('<Mount> elements are for router configuration and should not be rendered')
  },
})


module.exports.IndexMount = React.createClass({
  displayName: 'IndexMount',

  propTypes: {
    path: React.PropTypes.string.isRequired,
    component: React.PropTypes.func.isRequired,
  },

  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      if (parentRoute) {
        const component = element.props.component
        parentRoute.indexRoute = createRoute(component, component.junctionSet)
      } else {
        throw new Error('An <IndexMount> does not make sense at the root of your route config')
      }
    },
  },

  render: function render() {
    throw new Error('<IndexMount> elements are for router configuration and should not be rendered')
  },
})
