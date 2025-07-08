import { useParams } from 'next/navigation'
import React from 'react'

const ChangeEmail = () => {
    
  const { user_id } = useParams()
   return (
     <main>
       <div>ChangePassword</div>
       <p>{user_id}</p>
     </main>
   )
}

export default ChangeEmail