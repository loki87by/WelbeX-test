import React from 'react';

function Item(props) {
  return (
    <tr>
      <td>{props.item.date}</td>
      <td>{props.item.name}</td>
      <td>{props.item.quantity}</td>
      <td>{props.item.distance}</td>
    </tr>
  );
}
  
export default Item;