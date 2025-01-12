"use client";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Khởi tạo QueryClient
const queryClient = new QueryClient();

const fetchScores = async () => {
	const response = await fetch("/api/state", { method: "GET" });
	if (!response.ok) {
		throw new Error("Failed to fetch scores");
	}
	return response.json();
};

const updateScores = async (newScores) => {
	const response = await fetch("/api/state", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newScores),
	});
	if (!response.ok) {
		throw new Error("Failed to update scores");
	}
	return response.json();
};

const Control = () => {
	const queryClient = useQueryClient();

	// Fetch scores from server
	const { data: scores = { fighter1: 0, fighter2: 0 }, isLoading } = useQuery({
		queryKey: ["scores"],
		queryFn: fetchScores,
		refetchInterval: 100, // 1 giây để giữ trạng thái "fresh"
	});

	// Mutation for updating scores
	const mutation = useMutation({
		mutationFn: updateScores,
	});

	if (isLoading) {
		return <div className='text-white text-center'>Loading...</div>;
	}

	// Function to handle score updates
	const addPoints = (fighter, points) => {
		mutation.mutate({ [fighter]: points }); // Trigger mutation to update server
	};

	// Function to reset scores
	const resetScores = () => {
		mutation.mutate({ fighter1: 0, fighter2: 0 }); // Reset scores on server
	};

	return (
		<div className='h-dvh w-dvw bg-gradient-to-br relative from-blue-500 to-purple-700 flex flex-col items-center justify-center text-white'>
			<div className='bg-white text-gray-800 absolute top-0 right-0 h-full rounded-lg shadow-lg w-[100dvh] rotate-90 lg:rotate-0 lg:w-[100dvw] lg:h-[100dvh] flex flex-col items-center'>
				<div className='hidden lg:flex h-full w-full'>
					<div className='h-full flex-1 bg-blue-500 flex items-center justify-center font-bold text-[120px] text-white'>
						<h2>{scores?.fighter1}</h2>
					</div>
					<div className='h-full flex-1 bg-red-500 flex items-center justify-center font-bold text-[120px] text-white'>
						<h2>{scores?.fighter2}</h2>
					</div>
				</div>
				<div className='flex space-x-16 mt-6 lg:hidden'>
					<div className='flex flex-col items-center'>
						<h3 className='text-xl font-bold mb-4 text-blue-500'>Giáp Xanh</h3>
						<p className='text-4xl font-extrabold text-blue-600 mb-4'>{scores.fighter1}</p>
						<div className='flex space-x-8 mb-3'>
							<button
								key={1}
								onClick={() => addPoints("fighter1", 1)}
								className='bg-blue-500 text-2xl hover:bg-blue-600 text-white font-bold py-2 px-4 shadow-md transition-all transform active:!scale-90 w-32 h-32 rounded-full'>
								+{1}
							</button>
							<button
								key={2}
								onClick={() => addPoints("fighter1", 2)}
								className='bg-blue-500 text-2xl hover:bg-blue-600 text-white font-bold py-2 px-4 shadow-md transition-all transform active:!scale-90 w-32 h-32 rounded-full'>
								+{2}
							</button>
						</div>
						<button
							key={3}
							onClick={() => addPoints("fighter1", 3)}
							className='bg-blue-500 hover:bg-blue-600 text-2xl text-white font-bold py-2 px-4 shadow-md transition-all transform active:!scale-90 w-32 h-32 rounded-full'>
							+{3}
						</button>
					</div>

					<div className='flex flex-col items-center'>
						<h3 className='text-xl font-bold mb-4 text-blue-500'>Giáp Đỏ</h3>
						<p className='text-4xl font-extrabold text-red-600 mb-4'>{scores.fighter2}</p>
						<div className='flex space-x-8 mb-3'>
							<button
								key={1}
								onClick={() => addPoints("fighter2", 1)}
								className='bg-red-500 text-2xl hover:bg-red-600 text-white font-bold py-2 px-4 shadow-md transition-all transform active:!scale-90 w-32 h-32 rounded-full'>
								+{1}
							</button>
							<button
								key={2}
								onClick={() => addPoints("fighter2", 2)}
								className='bg-red-500 text-2xl hover:bg-red-600 text-white font-bold py-2 px-4 shadow-md transition-all transform active:!scale-90 w-32 h-32 rounded-full'>
								+{2}
							</button>
						</div>
						<button
							key={3}
							onClick={() => addPoints("fighter2", 3)}
							className='bg-red-500 text-2xl hover:bg-red-600 text-white font-bold py-2 px-4 shadow-md transition-all transform active:!scale-90 w-32 h-32 rounded-full'>
							+{3}
						</button>
					</div>
				</div>

				{/* <button
					onClick={resetScores}
					className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all transform active:!scale-90'>
					Reset Scores
				</button> */}
			</div>
		</div>
	);
};

export default Control;
