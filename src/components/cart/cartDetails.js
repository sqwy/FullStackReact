import React, {useContext, useEffect, useState} from 'react';
import ModifyItemDetail from "./ModifyItemDetail";
import {generalUrl, sellerUrl} from "../../urls/url";
import UserContext from "../../context/context";
import itemContext from "../../context/itemContext";
import classes from './cartDetails.module.css';

const CartDetails = (props) => {
    const [isModify,setIsModify] = useState(false);
    const [haveItem,setHaveItem] = useState(false);
    const [isExceedAmount,setIsExceedAmount] = useState(false);

    const usercxt = useContext(UserContext);
    const itemcxt = useContext(itemContext);
    const [currItemAmount,setCurrItemAmount] = useState(0);
    const clickModifyHandler = () => {
        setIsModify(prevState => !prevState);
    }

    const addToCartClickHandler = () => {
        itemcxt.items.splice(0,0,{
            id:props.item[0],
            name:props.item[1],
            price:props.item[2],
            amount:1
        })
        itemcxt.totalAmount += 1;
        itemcxt.totalPrice += props.item[2];
        setHaveItem(true);

        const index = itemcxt.items.indexOf(itemcxt.items.find((item)=>{
            return item.id === props.item[0];
        }));
        setCurrItemAmount(itemcxt.items[index].amount);
    }

    const addAmountHandler = () => {
        const index = itemcxt.items.indexOf(itemcxt.items.find((item)=>{
            return item.id === props.item[0];
        }));
        itemcxt.items[index].amount+=1;
        itemcxt.totalAmount += 1;
        itemcxt.totalPrice += props.item[2];
        setCurrItemAmount(itemcxt.items[index].amount);
        if(currItemAmount===props.item[3]){
            setIsExceedAmount(true);
        }
        // console.log(itemcxt);
    }
    const subAmountHandler = () => {
        const index = itemcxt.items.indexOf(itemcxt.items.find((item)=>{
            return item.id === props.item[0];
        }));
        itemcxt.items[index].amount-=1;
        itemcxt.totalAmount -= 1;
        itemcxt.totalPrice -= props.item[2];
        setCurrItemAmount(itemcxt.items[index].amount);
        if(itemcxt.items[index].amount===0){
            setHaveItem(false);
            itemcxt.items.splice(index,1);
        }
    }

    useEffect(()=>{
        if(itemcxt.items){
            const index = itemcxt.items.indexOf(itemcxt.items.find((item) => {
                return item.id === props.item[0];
            }));
            if(index!==-1){
                setCurrItemAmount(itemcxt.items[index].amount);
                setHaveItem(true);
            }
        }

    })


    const deleteItemHandler = () => {
        async function deleteData(){
            const res = await fetch(`${generalUrl}/seller/delete_item`,{
                method:'POST',
                body:JSON.stringify({
                    email:usercxt.email,
                    mid:props.item[0],
                })
            })
            if(res.ok){
                const response = await res.json();
                // console.log(response);
                alert('Success!');
                itemcxt.fetchData();
            }
        }
        deleteData();

    }

    return (
        <div className={classes.cartDetails}>
            {!isModify&&<ul>
                <li>{props.item[1]}</li>
                <li><div className={classes.price}>{props.item[2]}</div></li>
                <li>amount: {props.item[3]}</li>
                <li>{props.item[4]}</li>
                <li className={classes.imgOuter}><img src={props.item[5]} alt = "" className={classes.img}/></li>
            </ul>}
            <div className={classes.modifyItem}>{isModify&&<ModifyItemDetail item = {props.item}/>}</div>
            <div className={classes.cancelModify}>{isModify&&<button onClick={clickModifyHandler}>Cancel</button>}</div>
            {usercxt.identity?null:<button className={classes.modifyButton} onClick={clickModifyHandler}>Modify</button>}
            {usercxt.identity?null:<button onClick={() => {
                deleteItemHandler();
            }}>Delete</button>}
            <div className={classes.addToCart}>{usercxt.identity?
                haveItem?
                    <div>
                        <button onClick={addAmountHandler} className={classes.AddSubButton} disabled={currItemAmount>=props.item[3]}>+</button>
                        {currItemAmount}
                        <button onClick={subAmountHandler} className={classes.AddSubButton}>-</button>
                    </div>
                    :<button onClick={addToCartClickHandler} className={classes.AddToCartButton} disabled={props.item[3]===0}>Add to Cart</button>
                :null}</div>
        </div>
    );
};

export default CartDetails;