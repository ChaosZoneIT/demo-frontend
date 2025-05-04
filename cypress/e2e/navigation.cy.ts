describe('Navigation', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should navigate to reservation page from menu', () => {
      // Załóżmy, że masz link z tekstem "Rezerwacje"
      cy.get('[data-cy="nav-reservation"]').click();
      cy.get('[data-cy="nav-reservation"]').should('have.text', 'Rezerwacja');
      // Sprawdź, czy jesteś na właściwej stronie, np. po URL lub nagłówku
      cy.url().should('include', '/reservation');
      cy.contains('Rezerwacja leżaków').should('be.visible');
    });
  });