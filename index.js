const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.json());

const data = fs.readFileSync("./users.json", "utf8");
const users = JSON.parse(data);

app.get("/", (req, res) => {
  res.send(users);
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/user/:id", (req, res) => {
  let id = req.params.id;
  let user = users.find((el) => el.id === parseInt(id));
  res.send(user);
});

app.get("/userbycity/:city", (req, res) => {
  let city = req.params.city;
  let user = users.find((el) => el.address.city === city);
  res.send(user);
});

app.post("/user", (req, res) => {
  let name = req.body.name;
  let age = req.body.age;

  let newUser = { name, age };
  users.push(newUser);

  fs.writeFileSync("./users.json", JSON.stringify(users));
  res.send({ success: true });
});



app.put("/user/:id", async (req, res) => {
  let id = req.params.id;
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;

  try {
    const data = fs.readFileSync("./users.json", "utf8");

    let newUserData = {
      name,
      username,
      email,
    };
    users.push(newUserData);
    await fs.writeFileSync("./user/:id", JSON.stringify(users));
    res
      .status(200)
      .json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let users = JSON.parse(await fs.readFile('./users.json', 'utf8'));

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    users.splice(userIndex, 1);

    
    await fs.writeFile('./users.json', JSON.stringify(users));

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
