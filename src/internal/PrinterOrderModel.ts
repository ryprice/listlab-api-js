import Actor from 'listlab-api/Actor';

export const PRODUCT_NAME = 'Printed daily A7 cards (4.25 x 2.75)';

export const pricePerPage = (quantity: number) => {
  const count = pageCount(quantity);
  if (count <= 2) {
    return 4.75;
  } else if (count <= 4) {
    return 3.75;
  } else if (count <= 8) {
    return 3.25;
  } else {
    return 2.70;
  }
};

export const pricePerCard = (quantity: number) => {
  return (pricePerPage(quantity) / 8);
};

export const pageCount = (quantity: number) => Math.ceil(quantity/8);

export const weightCost = (weight: PaperWeights) => {
  if (weight === PaperWeights.EXTRAHEAVY) {
    return 2.50;
  } else {
    return 0;
  }
};

export const weightName = (weight: PaperWeights) => {
  if (weight === PaperWeights.LIGHTPRINTER) {
    return 'Lightweight';
  } else if (weight === PaperWeights.CARDSTOCK) {
    return 'Card stock';
  } else if (weight === PaperWeights.EXTRAHEAVY) {
    return 'Extra heavy';
  }
};

export const shippingCost = () => {
  return 3.00;
};

export const roundPrice = (price: number) => Math.round((price + Number.EPSILON) * 100) / 100;

export const productPrice = (order: PrinterOrder) => roundPrice(
  pricePerPage(order.quantity) * pageCount(order.quantity) +
  weightCost(order.weight)
);

export const totalCost = (order: PrinterOrder) => roundPrice(
  productPrice(order) +
  shippingCost()
);

type PrinterOrderAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
};

export type PrinterOrder = {
  orderId?: number,
  quantity?: number,
  weight?: number,
  list?: string[],
  email?: string,
  address?: PrinterOrderAddress;
  paypalOrderId?: string;
  paypalTransactionId?: string;
  actor?: Actor;
  timeCompleted?: Date;
  timeShipped?: Date;
};

export enum PaperWeights {
  LIGHTPRINTER = 1,
  CARDSTOCK = 2,
  EXTRAHEAVY = 3,
}