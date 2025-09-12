import React, { useEffect } from 'react'

function Testing() {
 console.log("render TestComp");
  useEffect(() => {
    console.log("🔥 effect from TestComp");
  }, []);
  return <div>TestComp</div>;
}

export default Testing