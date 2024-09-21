import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


const Verify = () => {
  const { name, email } = useSelector((state: RootState) => state.user);
  return (
    <div>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </div>
  )
}

export default Verify
