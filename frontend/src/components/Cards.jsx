import Card from "./Card";
import { useQuery } from "@apollo/client";
import {  GET_TRANSACTIONS } from "../graphql/queries/transaction";
import { GET_AUTH_USER } from "../graphql/queries/user";

const Cards = () => {

	const {loading, data, error} = useQuery(GET_TRANSACTIONS);
	const {data:authUser} = useQuery(GET_AUTH_USER);
	

	if(error) throw new Error(error.message)

	if(loading) return <p>Loading...</p>


	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
				{!loading && data.transactions.map((transaction)=>(
					<Card transaction={transaction} key={transaction._id} authUser={authUser.authUser}/>
				))}
				
			</div>
		</div>
	);
};
export default Cards;