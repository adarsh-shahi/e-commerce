import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import userInstance from "./repository/users.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ["fdasfhkdsafjhkhnnfisfdj"],
	})
);

// const bodyParser = (req, res, next) => {
// 	req.on("data", (data) => {
// 		const parsed = data.toString("utf-8").split("&");
// 		const formData = {};
// 		parsed.forEach((pair) => {
// 			const [key, value] = pair.split("=");
// 			formData[key] = value;
// 		});
// 		req.body = formData;
// 		next();
// 	});
// };

app.get("/", (req, res) => {
	res.send(`<div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password"/>
      <input name="passwordConfirmation" placeholder="password confimation"/>
      <button>Submit</button>
    </form>
    </div>`);
});

app.post("/", async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	try {
		const existingUser = await userInstance.getOneBy({ email });
		if (existingUser)
			throw new Error(`User already exists with Email: ${email}`);
		if (password !== passwordConfirmation)
			throw new Error(`password dosen't match`);
		const user = await userInstance.create({ email, password });
		req.session.userId = user.id;
		res.send("User created");
	} catch (err) {
		res.send(`Error Occured: ${err}`);
	}
});

app.listen(3000, () => {
	console.log("listening on 3000");
});
