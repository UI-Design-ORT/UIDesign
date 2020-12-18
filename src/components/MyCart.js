import React from 'react';
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { gql, useMutation, useQuery } from '@apollo/client';

const columns = [
    {
        name: 'title',
        label: 'Título',
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: 'size',
        label: 'Talle',
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: 'quantity',
        label: 'Cantidad en stock',
        options: {
            filter: false,
            sort: true,
        }
    },
];

const options = {
    /* filterType: "dropdown", */
    filterType: "checkbox",
    download: "false",
    print: "false",
    viewColumns: "false",
    responsive: "simple",
};

const useStyles = makeStyles((theme) => ({
    button: {
        margin: '8px',
    },
    container: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}));

const PROCESS_ORDER_MUTATION = gql`
  mutation processOrder{
    processOrder{
      userId
    }
  }
`;

/*const REMOVE_PROD_FROM_CART_MUTATION = gql`
  mutation RemoveProductFromCart($input: CartInput!){
    removeProductFromCart(input: $input){
      userId
      products {
            id
            title
            size
            quantity
            productImage
      }
    }
  }
`;*/

const CART_QUERY = gql`
  query ShoppingCart{
    shoppingCart{
        userId
        products {
            id
            title
            size
            quantity
            productImage
        }
    }
  }
`;

const MyCart = () => {
    const classes = useStyles();
    const [processOrderMutation] = useMutation(PROCESS_ORDER_MUTATION);
    const { data } = useQuery(CART_QUERY);
    const [products, setProducts] = React.useState([]);
    if (data) {
        setProducts(data.products);
    }

    const processOrder = async () => {
        const { outputCart } = await processOrderMutation();
        setProducts(outputCart.shoppingCart.products);
    };

    /*const onRemoveProductClick = async(event) => {
        //Falta implementacion
    }*/

    return (
        <>
            <MUIDataTable
                title={"Mis prendas"}
                data={products}
                columns={columns}
                options={options}
            /> {/* components={components} */}
            <div className={classes.container}>
                <Button className={classes.button} variant="contained" color="primary" onClick={processOrder}>Recibir</Button>
            </div>
        </>
    )
};

export default MyCart;