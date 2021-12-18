import { useState } from 'react'
import { useQuery } from 'react-query'
//import components
import Item from './Item/Item';
import Cart from './Cart/Cart';
//import components from material-ui/core
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';

//import components from material-ui/core
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

//Styles, 
//Now going to scaffhold out the style component and keep them in a separate file - App.styles.ts
//After adding export Wrapper in App.styles.ts import Wrapper here
import { Wrapper, StyledButton } from './App.styles';

//Types(structure from API) and we will see this structure when we get the data back
//so we export this type as we are gonna use it in other components also 
export type CartItemType = {
  //properties we get back from API
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  //our own property 
  //amount to keep track of the amount in our cart
  amount: number;
}


//using API "Fake Store Api"
//create fetching function for it outside app as we don't need to recreate it on each render
//it is an async function as we are going to fetch from an API 
//await inside parenthesis is for the api call itself and the other await is going to be used when we 
//convert it to json because converting to json is also async
//There is a string with a url inside await fetch and then .json which converts it to json 
//Returntype of getProducts function:
//it is a promise as we are using async,promise is generic in typescript so we can provide it with the type we want
const getProducts = async (): Promise<CartItemType[]> => 
   await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  //create states for cart
  const [cartOpen, setCartOpen] = useState(false);

  //we need a state with actual items that we have in our cart
  const[cartItems, setCartItems] = useState([] as CartItemType[]);

  //use react-query to fetch data
  //here useQuery is also generic
  
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products', 
    getProducts
  );
  console.log(data);

  //functions iterates over all items and gives total amount
  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack: number, item) => ack +  item.amount, 0);
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
        // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);  
      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };
  
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };
  
  if(isLoading) return <LinearProgress />
  if(error) <div>Something went wrong.....</div>;
  
  //Grid container containing grid item
  //use ?,otherwise it complains if it is undefined, using ? returns undefined if it can't find data
  //with .map() we mapthrough the data 
  //xs-extra smooth, sm-small medium
  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        /> 
      </Drawer>

      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item = {item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};
export default App;