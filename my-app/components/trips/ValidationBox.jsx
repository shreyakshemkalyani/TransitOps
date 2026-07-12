export default function ValidationBox({
cargo,
capacity
}){


if(cargo<=capacity)
return null;



return (

<div className="
border
border-red-500
rounded-xl
p-4
mt-5
text-red-400
">


<p>
Vehicle Capacity:
{capacity} kg
</p>


<p>
Cargo Weight:
{cargo} kg
</p>



<p>
❌ Capacity exceeded by
{cargo-capacity}
kg
</p>


</div>


)

}