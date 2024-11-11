import { memo } from 'react';
import {IActionButtonProps}from '../types/ActionButton'
import styled,{ keyframes } from 'styled-components';



export const ActionButton=memo((props:IActionButtonProps)=>{

    const {onClick,label,icon} = props
    const Button = styled.div`
height:50px;
width:50px;
border-radius:50%;
background-color:white;
display:flex;
justify-content:center;
align-items:center;
cursor:pointer;
margin:10px 20px;   `
    const handleClick = () => {
        console.log('clicked',label)
        onClick()
      };

    return <Button onClick={handleClick}>
        <img src={icon} alt={label??''} />
    </Button>

    

    

    
})