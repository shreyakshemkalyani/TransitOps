import TripItem from "./TripItem";


const trips=[

{
id:"TR001",
route:"Gandhinagar Depot → Ahmedabad Hub",
vehicle:"VAN-05",
driver:"Alex",
status:"DISPATCHED",
time:"45 min"
},


{
id:"TR004",
route:"Vatva Industrial Area → Sanand Warehouse",
vehicle:"TRUCK-04",
driver:"Suresh",
status:"DRAFT",
time:"Awaiting driver"
},


{
id:"TR006",
route:"Mansa → Kalol Depot",
vehicle:"Unassigned",
driver:"",
status:"CANCELLED",
time:"Vehicle went to shop"
}

]



export default function LiveBoard(){


return (

<div>


<h2 className="
text-sm
text-gray-400
mb-5
">

LIVE BOARD

</h2>



{

trips.map(
trip=>(

<TripItem
key={trip.id}
trip={trip}
/>

)

)

}



</div>

)

}