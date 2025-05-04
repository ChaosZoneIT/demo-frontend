import { Chair } from "@app/models/chair.model";

describe('Reservation calculation', () => {

  const chairApiUrl = Cypress.env('chairApiUrl');

  const standardChair: Chair = {id: 1, typ: 'standard', name: 'Leżak Standardowy', price: 25, available: 10};
  const premiumChair: Chair = {id: 2, typ: 'premium', name: 'Leżak Premium', price: 40, available: 6};
  const vipChair: Chair = {id: 3, typ: 'vip', name: 'Leżak Ekskluzywny', price: 50, available: 5};

  const chairsResponseDefault: Chair[] = [standardChair,premiumChair,vipChair];

  const updatedChairsResponseDefault: Record<string, Chair> = {
    [standardChair.id.toString()]: standardChair,
    [premiumChair.id.toString()]: premiumChair,
    [vipChair.id.toString()]: vipChair
  };

  let updatedChairsResponse: Record<string, Chair>;
  let chairsResponse: Chair[];

  beforeEach(() => {
    chairsResponse = chairsResponseDefault.map(chair => ({ ...chair }));;
    updatedChairsResponse = JSON.parse(JSON.stringify(updatedChairsResponseDefault));
    cy.intercept('GET', chairApiUrl, (req) => {
      req.reply({
        statusCode: 200,
        body: chairsResponse  // <- wtedy za każdym razem bierze aktualną wartość
      });
    }).as('mockedChairs');

    cy.intercept('PATCH', new RegExp(`^${chairApiUrl}/\\d+$`), (req) => {
      const id = req.url.split('/').pop();
  
      if (id && updatedChairsResponse[id]) {

        const index = chairsResponse.findIndex(c => c.id.toString() === id);

        chairsResponse[index] = updatedChairsResponse[id];

        req.reply({ statusCode: 200, body: updatedChairsResponse[id] });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('putChair');

    cy.visit('/reservation');
  });

  it('calculates total reservation price correctly', () => {
    // Przykład: pierwszy leżak - 2 sztuki, drugi - 3 sztuki
    cy.get('[data-cy="chair-input-0"]').clear().type('2');
    cy.get('[data-cy="chair-input-1"]').clear().type('3');

    cy.get('[data-cy="chair-available-0"]').should('contain', '10');
    cy.get('[data-cy="chair-available-1"]').should('contain', '6');
    cy.get('[data-cy="chair-available-2"]').should('contain', '5');

    // Pobierz ceny z tabeli (dynamiczne)
    cy.get('[data-cy="chair-price-0"]')
      .invoke('text')
      .then((price0Text) => {
        const price0 = parseFloat(price0Text.replace(' zł', ''));

        cy.get('[data-cy="chair-price-1"]')
          .invoke('text')
          .then((price1Text) => {
            const price1 = parseFloat(price1Text.replace(' zł', ''));
            const expectedTotal = 2 * price0 + 3 * price1;

            cy.get('[data-cy="reservation-total"]')
              .invoke('text')
              .should('contain', `${expectedTotal} zł`);
          });
      });
  });

  it('Rezerwacja możliwa w dostępnej ilości – pokazuje alert sukcesu', () => {

    setMockChair('1', { available: 7 });
    setMockChair('2', { available: 4 });

    cy.get('[data-cy="chair-available-0"]').should('exist').and('contain', '10');
    cy.get('[data-cy="chair-available-1"]').should('contain', '6');

    cy.get('[data-cy="chair-input-0"]').clear().type('3');
    cy.get('[data-cy="chair-input-1"]').clear().type('2');

    cy.get('[data-cy="reservation-total"]').should('contain', '155 zł');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('[data-cy="submit-reservation"]').click();

    cy.wait('@putChair');
    cy.wait('@putChair');

    cy.get('@alert').should('have.been.calledWith', 'Rezerwacja zakończona sukcesem!');

    cy.wait('@mockedChairs');

    cy.get('[data-cy="chair-available-0"]').should('contain', '7');
    cy.get('[data-cy="chair-available-1"]').should('contain', '4');
  });

  it('Rezerwacja przekraczająca dostępność – pokazuje alert błędu', () => {
    cy.get('[data-cy="chair-input-0"]').clear().type('12');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('[data-cy="submit-reservation"]').click();

    cy.get('@alert').should('have.been.calledWith', 'Niektóre leżaki nie są dostępne w żądanej ilości:\n\nLeżak "Leżak Standardowy": dostępnych 10, żądano 12');
  });

  function setMockChair(id:string, overrides: Partial<Chair>) {
    updatedChairsResponse[id] = {
      ...updatedChairsResponse[id],
      ...overrides
    };
  }
});
