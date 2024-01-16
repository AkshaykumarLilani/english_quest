if (!process.env.MONGO_URL){
    throw new Error("Mongodb url was not provided");
}

if (!process.env.JWT_SECRET){
    throw new Error("No JWT_SECRET present in the environment")
}