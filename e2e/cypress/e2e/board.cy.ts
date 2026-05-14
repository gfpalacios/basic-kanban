describe('Kanban Board E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear the board or wait for load if needed
    // Assuming backend might be reset or we just rely on UI state
  });

  it('should display the main board header', () => {
    cy.contains('h1', 'Kanban Board').should('be.visible');
  });

  it('should display default columns', () => {
    cy.contains('h3', 'To Do').should('be.visible');
    cy.contains('h3', 'In Progress').should('be.visible');
    cy.contains('h3', 'Done').should('be.visible');
  });

  it('should allow adding a new card to a column', () => {
    // Click "Add Card" on the "To Do" column
    cy.contains('h3', 'To Do')
      .parents('div.flex-col').first() // The column container
      .within(() => {
        cy.contains('button', 'Add Card').click();
        cy.get('input[placeholder="Card title..."]').type('New E2E Task');
        cy.contains('button', 'Add').click();
      });

    // Verify the card is added
    cy.contains('h4', 'New E2E Task').should('be.visible');
  });

  it('should allow deleting a card', () => {
    // Add a card first
    cy.contains('h3', 'To Do').parents('div.flex-col').first().within(() => {
      cy.contains('button', 'Add Card').click();
      cy.get('input[placeholder="Card title..."]').type('Task to Delete');
      cy.contains('button', 'Add').click();
    });

    cy.contains('h4', 'Task to Delete').should('be.visible');

    // Delete the card (hover to show the trash icon)
    cy.contains('h4', 'Task to Delete')
      .parents('.group')
      .within(() => {
        cy.get('button').click({ force: true }); // force true since it might be hidden until hover
      });

    // Verify it is removed
    cy.contains('h4', 'Task to Delete').should('not.exist');
  });

  it('should support undo and redo operations', () => {
    // Add a card
    cy.contains('h3', 'To Do').parents('div.flex-col').first().within(() => {
      cy.contains('button', 'Add Card').click();
      cy.get('input[placeholder="Card title..."]').type('Undo Task');
      cy.contains('button', 'Add').click();
    });

    cy.contains('h4', 'Undo Task').should('be.visible');

    // Click Undo
    cy.get('button[title="Undo (Ctrl+Z)"]').click();
    cy.contains('h4', 'Undo Task').should('not.exist');

    // Click Redo
    cy.get('button[title="Redo (Ctrl+Shift+Z)"]').click();
    cy.contains('h4', 'Undo Task').should('be.visible');
  });
});
