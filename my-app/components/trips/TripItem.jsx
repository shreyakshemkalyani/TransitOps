import TripStatusBadge from "./TripStatusBadge";


export default function TripItem({
trip
}){


return (

<div className="
border
border-gray-700
rounded-xl
p-5
mb-5
">


<div className="
flex
justify-between
">


<div>


<h3 className="font-bold">

{trip.id}

</h3>


<p className="text-gray-400">

{trip.route}

</p>


</div>



<div className="text-right">


<p>
{trip.vehicle}
</p>


<p className="text-gray-400">

{trip.time}

</p>


</div>


</div>



<TripStatusBadge
status={trip.status}
/>


</div>


)

}