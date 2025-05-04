describe('Homepage', () => {
    it('should load homepage and display title', () => {
      cy.visit('/');
      cy.contains('Wypożyczalnia Leżaków'); // lub inny tekst widoczny na stronie głównej
    });
  });