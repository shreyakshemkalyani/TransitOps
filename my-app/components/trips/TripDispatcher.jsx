"use client";


import {useState} from "react";

import TripLifeCycle from "./TripLifeCycle";
import TripForm from "./TripForm";
import LiveBoard from "./LiveBoard";


export default function TripDispatcher(){


const [status,setStatus]=useState("DRAFT");


return (

<div>


<div className="
flex
justify-between
mb-8
">


<h1 className="
text-2xl
font-bold
">
Trip Dispatcher
</h1>


<button
className="
border
px-5
py-2
rounded-lg
"
>
Dispatcher RK
</button>


</div>



<div className="
grid
grid-cols-2
gap-10
">


<div>


<TripLifeCycle
status={status}
/>



<TripForm

setStatus={setStatus}

/>


</div>



<div>

<LiveBoard/>

</div>


</div>


</div>

)

}