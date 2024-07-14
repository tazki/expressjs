const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { username, pwd } = req.body;
  if (!username || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = usersDB.users.find((user) => user.username === username);
  if (!foundUser)
    return res.status(401).json({ message: "Invalid credentials." });
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    res.json({ success: `User ${username} is logged in!` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
