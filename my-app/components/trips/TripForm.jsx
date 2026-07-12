"use client";


import {useState} from "react";

import ValidationBox from "./ValidationBox";


export default function TripForm({
setStatus
}){


const [cargo,setCargo]=useState(0);

const capacity=500;



return (

<div>


<h2 className="
mb-5
font-bold
">
CREATE TRIP
</h2>


<input
placeholder="Source"
className="input"
/>


<input
placeholder="Destination"
className="input"
/>



<input
placeholder="Vehicle Available"
className="input"
/>



<input
placeholder="Driver Available"
className="input"
/>



<input

type="number"

placeholder="Cargo Weight (KG)"

onChange={
e=>setCargo(
Number(e.target.value)
)
}

className="input"

/>



<input

placeholder="Planned Distance (KM)"

className="input"

/>



<ValidationBox

cargo={cargo}

capacity={capacity}

/>



<div className="
flex
gap-5
mt-5
">


<button

disabled={
cargo>capacity
}

onClick={
()=>setStatus("DISPATCHED")
}

className="
bg-blue-600
px-6
py-3
rounded-lg
disabled:bg-gray-700
"

>

Dispatch

</button>



<button
className="
px-6
py-3
border
rounded-lg
"
>

Cancel

</button>



</div>



</div>

)

}