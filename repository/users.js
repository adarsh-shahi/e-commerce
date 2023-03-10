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
		return attrs
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

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);
		if (!record) throw new Error(`Record with id ${id} not found`);
		Object.assign(record, attrs);
		await this.writeAll(records);
	}

	async getOneBy(filters) {
		let found = true;
		const records = await this.getAll();
		for (const record of records) {
			for (const key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
					break;
				}
			}
			if (found) return record;
		}
	}
}

export default new UsersRepository('users.json');
