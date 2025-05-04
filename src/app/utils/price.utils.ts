interface ChairLike {
    selected: number;
    price: number;
  }
  
  export function calculateTotalPrice(chairs: ChairLike[]): number {
    return chairs.reduce((total, chair) => total + chair.selected * chair.price, 0);
  }