import fs from "fs";

class UsersRepository {
	constructor(filename) {
		if (!filename) throw new Error("Creating a repository requires a filename");
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: "utf-8",
			})
		);
	}
}

const test = async () => {
	const userRepo = new UsersRepository("users.json");
	console.log(await userRepo.getAll());
};

test();
