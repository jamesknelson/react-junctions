import React, { Component } from 'react'
import { JunctionSet, Junction, Branch } from 'junctions'
import { Link } from 'react-router'
import ContactsScreen from './ContactsScreen'


const Content = Junction({
  Contacts: Branch({
    children: ContactsScreen.junctionSet,
    data: {
      Component: ContactsScreen
    }
  }),
}, 'Contacts')


export default class AppScreen extends Component {
  static junctionSet = JunctionSet({ content: Content }, 'content')

  render() {
    const locate = this.props.locate
    const { content } = this.props.routes //TODO: this.props.routes

    return (
      <div>
        <nav>
          <Link to={locate({ content: Content.branches.Contacts() })}>Contacts</Link>
        </nav>
        {/*<content.data.Component link={content.link} routes={content.children} params={content.params} />*/}
      </div>
    );
  }
}
