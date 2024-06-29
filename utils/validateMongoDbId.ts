//validatting the mongoDb id

import mongoose from "mongoose";

const validateMongoDbId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
// why we are validating the mongoDb id? because we need to check if the id is valid or not before querying the database. If the id is not valid, then we can return an error response to the user.

export default validateMongoDbId;
