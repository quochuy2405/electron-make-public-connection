import { create } from "zustand";

// Define the interface for the state
interface PointState {
	count: number;
	increase: () => Promise<void>;
	decrease: () => Promise<void>;
	reset: () => Promise<void>;
	setCount: (count: number) => void;
}

// Create the Zustand store to manage the state
export const usePoint = create<PointState>((set) => {
	// Fetch the count from the server initially


	return {
		count: 1, // Default state
		increase: async () => {
			const response = await fetch("/api/state", { method: "GET" });
			const data = await response.json();
			const newCount = data.count + 1;

			// Send the new state to the API route to save it
			await fetch("/api/state", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ count: newCount }),
			});

			set({ count: newCount });
		},
		decrease: async () => {
			const response = await fetch("/api/state", { method: "GET" });
			const data = await response.json();
			const newCount = data.count - 1;

			// Send the new state to the API route to save it
			await fetch("/api/state", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ count: newCount }),
			});

			set({ count: newCount });
    },
    setCount: async (newCount: number) => {
      // Send the new state to the API route to save it
      await fetch("/api/state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: newCount }),
      });

      set({ count: newCount });
    },
		reset: async () => {
			const newCount = 0;

			// Send the new state to the API route to save it
			await fetch("/api/state", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ count: newCount }),
			});

			set({ count: newCount });
		},
	};
});
