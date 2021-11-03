import React, { useEffect, useState } from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { useCart } from '../../hooks/useCart';

import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}
interface ProductFormated extends Product {
  priceFormatted: string;
  subTotal: string;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  const [cartFormatedInScreen, setCartFormatedInScreen] = useState<ProductFormated[]>([])

  useEffect(()=>{
    const cartFormatted: ProductFormated[] = cart.map(product => {
      return{
        id: product.id,
        title: product.title,
        price: product.price,
        priceFormatted: formatPrice(product.price),
        subTotal: formatPrice(product.price * product.amount),
        image: product.image,
        amount: product.amount,
      }
    })
    setCartFormatedInScreen([...cartFormatted])
  },[cart])

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        const value = product.price * product.amount

        sumTotal += value

        return sumTotal
      }, 0)
    )

  function handleProductIncrement(productId: number, amount: number) {
    updateProductAmount({productId, amount})
  }

  function handleProductDecrement(productId: number, amount: number) {
    updateProductAmount({productId, amount})
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatedInScreen.map(product=>{
            return(
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt="Imagem do produto" />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <span>{product.price}</span>
                </td>
                <td>
                  <div>
                    <button
                      type='button'
                      data-testid="decrement-product"
                      disabled={product.amount <= 1}
                      onClick={() => handleProductDecrement(product.id, -1)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input 
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={product.amount}
                    />
                    <button
                      type='button'
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(product.id, 1)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{product.subTotal}</strong>
                </td>
                <td>
                  <button
                    type='button'
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
