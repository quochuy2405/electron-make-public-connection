import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Đường dẫn đến file JSON lưu trạng thái
const filePath = path.join(process.cwd(), "renderer/app/api/state/points.json");

// Đọc trạng thái từ file JSON
const loadState = (): { fighter1: number; fighter2: number } => {
	try {
		const data = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		// Nếu không thể đọc file, trả về trạng thái mặc định
		return { fighter1: 0, fighter2: 0 };
	}
};

// Lưu trạng thái vào file JSON
const saveState = (state: { fighter1: number; fighter2: number }): void => {
	try {
		const jsonState = JSON.stringify(state, null, 2); // Format JSON để dễ đọc
		fs.writeFileSync(filePath, jsonState, "utf-8");
	} catch (error) {
		console.error("Error saving state:", error);
	}
};

export async function GET() {
	const state = loadState(); // Đọc trạng thái từ file
	return NextResponse.json({
		fighter1: state.fighter1 || 0,
		fighter2: state.fighter2 || 0,
	}); // Trả về trạng thái dưới dạng JSON
}

export async function POST(req: Request) {
	try {
		const data = await req.json(); // Lấy dữ liệu từ body request
		const state = loadState(); // Đọc trạng thái từ file
		const newData = {
			fighter1: state.fighter1 + (data?.fighter1 || 0),
			fighter2: state.fighter2 + (data.fighter2 || 0),
		};
		saveState(newData); // Lưu trạng thái mới vào file
		return NextResponse.json(newData); // Trả về trạng thái mới
	} catch (error) {
		return NextResponse.json({ error: "Failed to save state" }, { status: 500 });
	}
}
