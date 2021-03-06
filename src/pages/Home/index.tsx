import { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
    
  // }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<ProductFormatted[]>('http://localhost:3333/products')
      const responseFormated: ProductFormatted[] = response.data.map((element)=>{
        return{
          id: element.id,
          title:element.title,
          price: element.price,
          priceFormatted: formatPrice(element.price),
          image: element.image
        }
      })
      setProducts(responseFormated)
    }
    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(element=>{
        return(
          <li key={element.id}>
            <img src={element.image} alt="Imagem do produto" />
            <strong>{element.title}</strong>
            <span>{formatPrice(element.price)}</span>
            <button
              type='button'
              data-testid="add-product-button"
              onClick={() => handleAddProduct(element.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {/* {cartItemsAmount[product.id] || 0} */} 2
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        )
      })}
    </ProductList>
  );
};

export default Home;
