import fs from "fs";
import crypto from "crypto";

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

	async create(attrs) {
		attrs.id = this.randomID();
		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);
	}

	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	randomID() {
		return crypto.randomBytes(4).toString("hex");
	}
}

const test = async () => {
	const userRepo = new UsersRepository("users.json");
	console.log(await userRepo.getAll());
	await userRepo.create({
		email: "adarsh@me.dev",
		password: "mb3000",
	});
	console.log(await userRepo.getAll());
	await userRepo.create({
		email: "atharva@me.coo",
		password: "aw3000",
	});
	console.log(await userRepo.getAll());
};

test();
