import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)

    const [relDoc, setRelDoc] = useState([])


  return (
    <div>
      
    </div>
  )
}

export default RelatedDoctors
