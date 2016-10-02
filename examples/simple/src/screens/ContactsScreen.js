import React, { Component } from 'react'
import { Link } from 'react-router'
import { JunctionSet, Junction, Branch, Param } from 'junctions'
import ContactScreen from './ContactScreen'


const Content = Junction({
  List: Branch(),
  Details: Branch({
    params: {
      id: Param({ required: true }),
      slug: Param(),
    },
    data: {
      Component: ContactScreen
    },
  }),
}, 'List')

const Modal = Junction({
  Add: Branch(),
})


export default class ContactsScreen extends Component {
  static junctionSet = JunctionSet({ content: Content, modal: Modal }, 'content')

  render() {
    const locate = this.props.locate
    const { content, modal } = this.props.routes

    return (
      <div>
        <div>
          <nav>
            <Link to={ locate({ content, modal: Modal.Add() }) }>Add</Link>
          </nav>
          <ul>
            <li>
              <Link to={ locate({ content: Content.Details({ id: 'abcdef', slug: 'james-nelson' }) }) }>James Nelson</Link>
            </li>
          </ul>
        </div>
        {
          content.data.Component &&
          <content.data.Component locate={content.getLocation} routes={content.children} params={content.params} />
        }
      </div>
    )
  }
}
