export default function TripLifeCycle({
status
}){


const steps=[
"Draft",
"Dispatched",
"Completed",
"Cancelled"
];


return (

<div className="
mb-8
">


<h3 className="
text-sm
text-gray-400
mb-5
">

TRIP LIFECYCLE

</h3>


<div className="
flex
items-center
gap-8
">


{
steps.map(
(step,index)=>(


<div
key={step}
className="flex flex-col items-center"
>


<div
className={`
h-4
w-4
rounded-full

${status===step.toUpperCase()
?
"bg-blue-500"
:
"bg-gray-600"}

`}
>


</div>


<p className="
text-xs
mt-2
">

{step}

</p>


</div>


)

)

}


</div>


</div>

)

}