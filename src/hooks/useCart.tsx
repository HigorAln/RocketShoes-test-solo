import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({productId, amount}: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    if(storagedCart === null){
      return []
    }
    return [storagedCart];
  });

  const addProduct = async (productId: number) => {
    try {
      const {data, status} = await api.get(`http://localhost:3333/products/${productId}`)

      if(status === 200) {
        const findItemInCart = cart.find(element => element.id === productId)
        if(findItemInCart === undefined) {
          // no have item in cart
          const newProduct = {
            id: data.id,
            title: data.title,
            price: data.price,
            image: data.image,
            amount: 1,
          }

          const value = newProduct
          const newCart = [...cart, value]
          const local = JSON.stringify(newCart)
          localStorage.setItem('@RocketShoes:cart', local)

          setCart([...cart, newProduct])

        }else{
          // have item in cart
          const {data} = await api.get(`http://localhost:3333/stock/${findItemInCart.id}`)
          if((findItemInCart.amount + 1) > data.amount){
            toast.error('Ops nao temos em estoque')
          }else{
            const newCart = cart;
            newCart.forEach((element, index)=>{
              if(element.id === findItemInCart.id) {
                element.amount += 1
              }
            })
            const local = JSON.stringify(newCart)
            localStorage.setItem('@RocketShoes:cart', local)
            
            setCart([...newCart]) 
          }
        }        
      }else{
        toast.error('Erro na adição do produto');
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const index = cart.findIndex(element=> element.id === productId)
      const newArrayRemoveItem = cart
      newArrayRemoveItem.splice(index, 1)

      const local = JSON.stringify(newArrayRemoveItem)
      localStorage.setItem('@RocketShoes:cart', local)
      setCart([...newArrayRemoveItem])
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({productId, amount}: UpdateProductAmount)  => {
    try {
      if(amount === 1){
      const product =cart.find(element => element.id === productId)
      if(product !== undefined) {

        if(product.amount <= 0){
          return  // parte do desafio
        }else{
            // INCREMENT
            const {data} = await api.get(`http://localhost:3333/stock/${productId}`)
            if((product.amount + 1) > data.amount){
              toast.error('Quantidade solicitada fora de estoque')
              
            }else{
              const newCartFormatedInScreen = cart
              newCartFormatedInScreen.forEach((element)=>{
                if(element.id === productId){
                  element.amount += 1
                }
              })
              const local = JSON.stringify(newCartFormatedInScreen)
              localStorage.setItem('@RocketShoes:cart', local)
              setCart([...newCartFormatedInScreen]) 
            }
          }
        }
      }else{
        //DECREMENT
        const newCartFormatedInScreen = cart
        newCartFormatedInScreen.forEach((element,index)=>{
          if(element.id === productId){
            element.amount -= 1
          }
        })
        const local = JSON.stringify(newCartFormatedInScreen)
        localStorage.setItem('@RocketShoes:cart', local)
        setCart([...newCartFormatedInScreen])
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
