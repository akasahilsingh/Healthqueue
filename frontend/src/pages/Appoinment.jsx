import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'



const Appoinment = () => {

  const { docId } = useParams();
  const { doctors } = useContext(AppContext)
  console.log(docId);
  return (
    <div>
      
    </div>
  )
}

export default Appoinment
