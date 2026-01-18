describe('core paths', () => {
  it('home', () => {
    cy.visit('/')
    cy.get('main').should('exist')
  })

  it('posts', () => {
    cy.visit('/posts')
    cy.get('main').should('exist')
  })

  it('notes', () => {
    cy.visit('/notes')
    cy.get('main').should('exist')
  })

  it('projects', () => {
    cy.visit('/projects')
    cy.get('main').should('exist')
  })

  it('timeline', () => {
    cy.visit('/timeline')
    cy.get('main').should('exist')
  })
})

