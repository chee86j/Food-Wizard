import { DataTypes } from "sequelize";

// Define the Search model
const defineSearchModel = (sequelize) => {
  const Search = sequelize.define("searches", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Search;
};

export default defineSearchModel;
