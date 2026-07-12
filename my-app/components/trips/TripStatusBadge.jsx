export default function TripStatusBadge({
status
}){


const colors={

DISPATCHED:
"bg-blue-500",

DRAFT:
"bg-gray-600",

CANCELLED:
"bg-red-500",

COMPLETED:
"bg-green-500"

}



return (

<span
className={`
inline-block
px-4
py-1
rounded
mt-3
${colors[status]}
`}
>

{status}

</span>


)

}