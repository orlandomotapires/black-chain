const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importa o pacote cors

// Configurações de conexão com o banco de dados
let password = "123";
const sequelize = new Sequelize("blackchain", "postgres", password, {
	host: "postgres",
	dialect: "postgres",
});

// Definição do modelo Player
const Player = sequelize.define(
	"Player",
	{
		player_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		player_name: {
			type: DataTypes.STRING,
		},
		nft_amount: {
			type: DataTypes.INTEGER,
		},
		password: {
			type: DataTypes.STRING,
			defaultValue: "123",
		},
		player_age: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: "player",
		timestamps: false,
	}
);

// Inicializando o aplicativo Express
const app = express();
const PORT = 8001;

app.use(cors()); // Habilita o CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de login
app.post("/login", async (req, res) => {
	const { player_id } = req.body;
	try {
		const player = await Player.findByPk(player_id);
		if (player) {
			res.status(200).json(player);
		} else {
			res.status(404).json({ message: "Player not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error", error });
	}
});

// Iniciando o servidor e conectando ao banco de dados
app.listen(PORT, async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync(); // Garante que o banco de dados está em sincronia com os modelos
		console.log("Connection has been established successfully.");
		console.log(`Server is running on http://localhost:${PORT}`);
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
});
