import express from "express";

const app = express();

const bodyParser = (req, res, next) => {
	req.on("data", (data) => {
		const parsed = data.toString("utf-8").split("&");
		const formData = {};
		parsed.forEach((pair) => {
			const [key, value] = pair.split("=");
			formData[key] = value;
		});
		req.body = formData;
		next();
	});
};

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

app.post("/", bodyParser, (req, res) => {
	console.log(req.body);
	res.send("app created");
});

app.listen(3000, () => {
	console.log("listening on 3000");
});
