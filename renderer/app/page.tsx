"use client";
import { useQuery } from "@tanstack/react-query";
import { usePoint } from "../hooks";

const App = () => {
	const { increase, decrease, reset } = usePoint();
	const { data } = useQuery({
		queryKey: ["points"],
		queryFn: () => fetch("/api/state", { method: "GET" }).then((res) => res.json()),
		refetchInterval: 500,
  });
  
  

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 flex flex-col items-center justify-center text-white'>
			<div className='bg-white text-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center'>
				<h2 className='text-5xl font-extrabold mb-4'>Counter: {data?.count||1}</h2>

				<div className='flex space-x-4'>
					<button
						onClick={increase}
						className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105'>
						Increase
					</button>

					<button
						onClick={decrease}
						className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105'>
						Decrease
					</button>

					<button
						onClick={reset}
						className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105'>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
};

export default App;
