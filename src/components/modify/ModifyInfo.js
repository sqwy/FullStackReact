import React, {useCallback, useContext, useState} from 'react';
import UserContext from "../../context/context";
import {customerUrl, generalUrl, sellerUrl} from "../../urls/url";
import storageUtils from "../../utils/storageUtils";
import classes from './ModifyInfo.module.css';

const ModifyInfo = () => {

    const usercxt = useContext(UserContext);
    const [userData,setUserData] = useState({
        username:usercxt.username,
        address:usercxt.address
    })

    const usernameChangeListener = (event) => {
        setUserData({
            ...userData,
            username: event.target.value,
        })
    }

    const addressChangeListener = (event) => {
        setUserData({
            ...userData,
            address: event.target.value,
        })
    }
    const updateData = useCallback(async ()=>{
        const url = usercxt.identity?`${generalUrl}/customer`:`${generalUrl}/seller`
        console.log({
            email:usercxt.email,
            username:userData.username,
            address:userData.address,
        });
        const res = await fetch(`${url}/modifyinfo`,{
            method:'POST',
            body:JSON.stringify({
                email:usercxt.email,
                username:userData.username,
                address:userData.address,
            })
        },[]);
        if(res.ok){
            const response = await res.json();
            storageUtils.removeUser();
            usercxt.username = userData.username;
            usercxt.address = userData.address;
            storageUtils.saveUser({
                email:usercxt.email,
                username:usercxt.username,
                address:usercxt.address,
                identity:usercxt.identity,
            })
            alert(response.message);
        }
    })

    const submitUserDataHandler = (event) => {
        event.preventDefault();
        updateData();
    }

    return (
        <div>
            <form className={classes.form} onSubmit={submitUserDataHandler}>
                <label htmlFor="username">username:</label>
                <input type="text" name={'username'} defaultValue={usercxt.username} onChange={usernameChangeListener}/><br/>
                <label htmlFor="address">address:</label>
                <input type="text" name={'address'} defaultValue={usercxt.address} onChange={addressChangeListener}/><br/>
                <button type={"submit"}>confirm</button>
            </form>
        </div>
    );
};

export default ModifyInfo;