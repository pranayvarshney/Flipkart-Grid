import React from 'react'
import NFTcard from './NFTcard';

function ParentComp({uri}) {
 
  return (
    <>
        {uri && uri.map(prop=>{
            return (<NFTcard prop={prop} key={prop}/>)
            
        })}
    </>  
  )
}

export default ParentComp 