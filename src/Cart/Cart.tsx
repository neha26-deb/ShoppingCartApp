import CartItem from '../CartItem/CartItem';

//Styles
import { Wrapper } from './Cart.styles';

//Types
import { CartItemType } from '../App';

type Props = {
    cartItems: CartItemType[]; //CartItemType[] is an array which will receive all items yhat is in cart
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
}

//create component
const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const calculateTotal = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);
    //wrapper is the styled-component we created
    //line 22 deals with when we have no items in cart
    return (
        <Wrapper>
           <h2>Your Shopping Cart</h2>
           {cartItems.length == 0 ? <p>No items in cart.</p> : null}
           {cartItems.map(item => (
               <CartItem 
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}                
               />
            ))}
            <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
        </Wrapper>
    );
};
export default Cart;
