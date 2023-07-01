import React from 'react'
import CommentSection from './CommentSection'

describe('<CommentSection />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CommentSection />)
  })
})