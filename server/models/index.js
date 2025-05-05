import defineSearchModel from "./Search.js";

const initModels = (sequelize) => {
  // Define models & Associations later
  const Search = defineSearchModel(sequelize);

  return {
    Search,
  };
};

export default initModels;
