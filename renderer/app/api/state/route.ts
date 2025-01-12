import fs from "fs";
import { NextResponse } from "next/server";

// Đường dẫn đến file JSON lưu trạng thái
const filePath = "./points.json";

// Đọc trạng thái từ file JSON
const loadState = (): { count: number } => {
	try {
		const data = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		// Nếu không thể đọc file, trả về trạng thái mặc định
		return { count: 1 };
	}
};

// Lưu trạng thái vào file JSON
const saveState = (state: { count: number }): void => {
	try {
		fs.writeFileSync(filePath, JSON.stringify(state), "utf-8");
	} catch (error) {
		console.error("Error saving state:", error);
	}
};

export async function GET() {
	const state = loadState(); // Đọc trạng thái từ file
	return NextResponse.json(state); // Trả về trạng thái dưới dạng JSON
}

export async function POST(req: Request) {
	try {
		const { count } = await req.json(); // Lấy dữ liệu từ body request
		saveState({ count }); // Lưu trạng thái mới vào file
		return NextResponse.json({ count }); // Trả về trạng thái mới
	} catch (error) {
		return NextResponse.json({ error: "Failed to save state" }, { status: 500 });
	}
}
